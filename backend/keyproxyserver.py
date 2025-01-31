from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
from pymongo import MongoClient
import base64
import os
import json
from datetime import datetime, timedelta
from google.cloud import secretmanager
from google.oauth2 import service_account
import boto3
from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient
from functools import wraps

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Security Configurations
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")  # Use environment variable for JWT secret
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# MongoDB Atlas Connection
MONGO_URI = os.getenv("MONGO_URI", "yoururl")
client = MongoClient(MONGO_URI)
db = client["keyproxydb"]
users_collection = db["users"]
audit_logs_collection = db["audit_logs"]

# Helper Functions
def encode_credentials(credentials):
    return {key: base64.b64encode(str(value).encode()).decode() for key, value in credentials.items()}

def decode_credentials(encoded_credentials):
    return {key: base64.b64decode(value).decode() for key, value in encoded_credentials.items()}

def log_audit_event(email, action, secret_name=None, status="Success"):
    audit_logs_collection.insert_one({
        "customer_email": email,
        "action": action,
        "secret_name": secret_name,
        "status": status,
        "timestamp": datetime.utcnow()
    })

def role_required(role):
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user = get_jwt_identity()
            user = users_collection.find_one({"email": current_user})
            if not user or user.get("role") != role:
                return jsonify({"error": "Unauthorized access"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# KMS Handlers
def store_secret_gcp(project_id, secret_name, secret_value, credentials_json):
    credentials = service_account.Credentials.from_service_account_info(json.loads(credentials_json))
    client = secretmanager.SecretManagerServiceClient(credentials=credentials)
    parent = f"projects/{project_id}"
    secret = client.create_secret(request={
        "parent": parent,
        "secret_id": secret_name,
        "secret": {"replication": {"automatic": {}}}
    })
    client.add_secret_version(request={
        "parent": secret.name,
        "payload": {"data": secret_value.encode()}
    })
    return f"gcp_secret_ref_{secret_name}"

def store_secret_aws(secret_name, secret_value, aws_access_key, aws_secret_key):
    session = boto3.Session(
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key
    )
    client = session.client("secretsmanager")
    response = client.create_secret(Name=secret_name, SecretString=secret_value)
    return response["ARN"]

def store_secret_azure(vault_url, secret_name, secret_value, tenant_id, client_id, client_secret):
    credential = ClientSecretCredential(tenant_id, client_id, client_secret)
    client = SecretClient(vault_url=vault_url, credential=credential)
    client.set_secret(secret_name, secret_value)
    return f"azure_secret_ref_{secret_name}"

# Routes
@app.route("/create-secret", methods=["POST"])
@jwt_required()
def create_secret():
    email = get_jwt_identity()
    data = request.json
    secret_name = data.get("secret_name")
    secret_value = data.get("secret_value")
    
    if not secret_name or not secret_value:
        return jsonify({"error": "Secret name and value are required"}), 400
    
    user = users_collection.find_one({"email": email})
    if not user or "kms_provider" not in user:
        return jsonify({"error": "KMS not configured"}), 400
    
    kms_reference = ""
    if user["kms_provider"] == "GCP":
        kms_reference = store_secret_gcp(
            user["kms_credentials"]["project_id"],
            secret_name,
            secret_value,
            base64.b64decode(user["kms_credentials"]["service_account_json"]).decode()
        )
    elif user["kms_provider"] == "AWS":
        kms_reference = store_secret_aws(
            secret_name,
            secret_value,
            user["kms_credentials"]["aws_access_key"],
            user["kms_credentials"]["aws_secret_key"]
        )
    elif user["kms_provider"] == "Azure":
        kms_reference = store_secret_azure(
            user["kms_credentials"]["vault_url"],
            secret_name,
            secret_value,
            user["kms_credentials"]["tenant_id"],
            user["kms_credentials"]["client_id"],
            user["kms_credentials"]["client_secret"]
        )
    
    log_audit_event(email, "Create Secret", secret_name)
    return jsonify({"message": "Secret stored successfully", "kms_reference": kms_reference}), 201

@app.route("/get-kms", methods=["GET"])
@jwt_required()
def get_kms():
    email = get_jwt_identity()
    user = users_collection.find_one({"email": email}, {"_id": 0, "kms_provider": 1, "kms_credentials": 1})
    if not user:
        return jsonify({"error": "KMS configuration not found"}), 404
    return jsonify(user), 200

if __name__ == "__main__":
    app.run(debug=True)
