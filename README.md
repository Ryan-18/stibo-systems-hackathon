# stibo-systems-hackathon
# KeyProxyServer

## Overview
KeyProxyServer is a secure and scalable key management proxy that provides a unified API for interacting with multiple Key Management Systems (KMS). It allows organizations to securely store and retrieve secrets while leveraging KMS providers such as:
- **Google Cloud Secret Manager (GCP)**
- **AWS Secrets Manager**
- **Azure Key Vault**

This application ensures data security through **Role-Based Access Control (RBAC)**, **JSON Web Token (JWT) authentication**, and **audit logging**, making it a robust solution for managing sensitive information in a multi-cloud environment.

---
## Features
### 1. Multi-Cloud KMS Integration
- Securely store and retrieve secrets from **GCP Secret Manager**, **AWS Secrets Manager**, and **Azure Key Vault**.
- Uses provider-specific authentication mechanisms for enhanced security.

### 2. Role-Based Access Control (RBAC)
- **Admin Role**: Configure KMS settings, view audit logs.
- **User Role**: Create, retrieve, and manage secrets.
- Access control enforced using JWT claims.

### 3. JWT Authentication
- Secure access using **JSON Web Tokens (JWT)**.
- **Token expiration** to prevent session hijacking.

### 4. Audit Logging
- Tracks all critical actions: **user signups, logins, secret creation, and retrieval**.
- Logs stored securely in **MongoDB Atlas**.

### 5. Secure Credential Handling
- **Base64 encoding** for sensitive credentials before storage.
- **Environment variables** used to store JWT secrets and database URIs.
### 6.Zero Trust Architecture: 
- **No internal employee or developer has access to customer secrets.

---
## How It Works
### 1. User Authentication & Signup
- Users sign up with their **email, password, and KMS selection**.
- Passwords are securely stored using **bcrypt hashing**.
- On successful signup, an **audit event is logged**.

### 2. JWT-based Authentication
- Users log in using their email and password.
- Upon successful authentication, an **access token is generated**.
- The token is required for all subsequent API requests.

### 3. KMS Configuration
- Admins can configure KMS settings for their organization.
- Each user’s KMS settings are stored in the database.

### 4. Secret Storage & Retrieval
- Users can store secrets in their selected KMS provider.
- The application securely authenticates with the KMS provider to store/retrieve secrets.
- Only authorized users can access their secrets.

### 5. Audit Logs
- Admins can retrieve audit logs to monitor activity.
- Logs include details of user actions with timestamps.

---
## Security Implementations
### 1. Role-Based Access Control (RBAC)
- **Admins** can configure KMS and view logs.
- **Users** can store and retrieve their own secrets.
- Unauthorized access attempts are **blocked and logged**.

### 2. JWT Authentication
- **Access tokens** are used for secure API access.
- Token expiration ensures **session security**.
- Tokens contain user roles for **access control enforcement**.

### 3. Secure Secret Storage
- Secrets are never stored directly in the database.
- Instead, they are securely stored in **GCP, AWS, or Azure KMS**.
- Only the secret reference is stored in MongoDB.

### 4. Environment Variables for Sensitive Data
- **JWT secrets, MongoDB URIs, and KMS credentials** are stored in **environment variables** to prevent exposure.

### 5. Audit Logging
- Every user action is **logged with a timestamp**.
- Admins can track all activity for **compliance and security monitoring**.

---
## API Endpoints
| Method | Endpoint | Description | Access |
|--------|-------------|-----------------|--------|
| POST | `/signup` | User Signup | Public |
| POST | `/login` | User Login | Public |
| POST | `/configure-kms` | Configure KMS | Admin |
| POST | `/create-secret` | Store Secret in KMS | User |
| GET | `/get-all-secrets` | Retrieve All Secrets | User |
| GET | `/audit-logs` | View Audit Logs | Admin |

## Role-Based Access Control (RBAC)
| Role        | Create Secret | Read Secret | Update Secret | Delete Secret | Manage KMS | View Audit Logs |
|------------|--------------|-------------|---------------|---------------|------------|----------------|
| Customer   | ✅            | ✅           | ✅             | ✅             | ✅          | ✅              |
| saas       | ❌            | ✅           | ❌             | ❌             | ❌          | ❌              |
| Developer  | ❌            | ❌           | ❌             | ❌             | ❌          | ❌              |
| Employee   | ❌            | ❌           | ❌             | ❌             | ❌          | ❌              |

---
## Setup & Installation
### Prerequisites
- **Python 3.8+**
- **MongoDB Atlas account**
- **Google Cloud / AWS / Azure credentials**

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/your-repo/keyproxyserver.git
cd keyproxyserver

# Create a virtual environment
python -m venv venv
source venv/bin/activate   # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export JWT_SECRET_KEY='your_jwt_secret_key'
export MONGO_URI='your_mongodb_atlas_uri'
export AWS_ACCESS_KEY='your_aws_access_key'
export AWS_SECRET_KEY='your_aws_secret_key'
export GCP_CREDENTIALS_JSON='your_gcp_service_account_json'
export AZURE_TENANT_ID='your_azure_tenant_id'
export AZURE_CLIENT_ID='your_azure_client_id'
export AZURE_CLIENT_SECRET='your_azure_client_secret'
export AZURE_VAULT_URL='your_azure_vault_url'

# Run the application
python app.py
```

---
## Conclusion
KeyProxyServer provides **multi-cloud KMS support**, **strong authentication**, and **secure access control** with **audit logging** to ensure secrets are protected. It is an **enterprise-grade solution** for organizations requiring a **secure and centralized key management system** across different cloud providers.



## Customer Portal
The customer portal is a web-based dashboard built with **React, TypeScript, and Vite**. It provides the following functionalities:

### **Dashboard**
- Overview of stored secrets.
- Audit logs showing all actions performed on secrets.

### **Key Management**
- Add new encryption keys.
- Delete existing keys.
- Encrypt and decrypt data using customer-managed keys.

### **Secret Management**
- Store and manage API keys, database credentials, and other secrets securely.
- Retrieve secrets securely using RBAC policies.
- Grant or revoke access to secrets as needed.

## Security Measures
- **RBAC Enforcement**: Only customers can manage secrets.
- **JWT Authentication**: Ensures only authenticated requests can access APIs.
- **Audit Logging**: Tracks all actions for security and compliance.
- **Data Encryption**: Uses KMS-based encryption for maximum security.

## Access Control & SaaS Integration
- **SaaS Platform Access**: The SaaS platform can securely retrieve secrets for system operations but cannot display them.
- **No Employee Access**: Employees, including developers, cannot access stored secrets under any circumstances.
- **Secure API Integration**: Ensures that secrets are used only for authorized external system connections.

---
a consideration to include could be:

Storing metadata or credentials in an encrypted database may not be the most secure solution. While encryption can provide a layer of protection, the keys required to decrypt the data are often stored alongside the encrypted data itself, which can create vulnerabilities if those keys are compromised. A more secure approach would be to use Azure Key Vault for managing sensitive information like credentials and metadata. Azure Key Vault provides secure storage, access control, and audit capabilities, ensuring that secrets are protected and reducing the risk of unauthorized access. It also simplifies key management by offering features like automatic key rotation and integration with Azure's security policies.
1. Encryption at Rest: MongoDB Atlas provides encryption at rest by default, which ensures that data stored on disk is encrypted. However, this encryption is only as secure as the keys used to encrypt and decrypt the data. The database's encryption keys need to be managed securely to avoid potential compromises.

2. Key Management Risks: If you're storing sensitive metadata or credentials in MongoDB, you're likely managing the keys to decrypt this data within the same system. This could expose your keys to security risks, especially if someone gains unauthorized access to the MongoDB instance or if the key management practices aren't robust enough.

3. Azure Key Vault vs. Encrypted MongoDB: While MongoDB Atlas' encryption is good for protecting data on disk, using a dedicated secret management service like Azure Key Vault for storing and managing credentials, encryption keys, and metadata is a more secure approach. Azure Key Vault offers enhanced control, allowing you to:

Isolate Secrets: Credentials and keys are stored separately from your database, preventing attackers from accessing both in a breach.
Key Rotation and Policies: Azure Key Vault supports automatic key rotation, ensuring that encryption keys remain secure over time, and it provides fine-grained access control to protect sensitive data.
Access Control and Logging: You can implement Azure's role-based access control (RBAC) to limit who can access secrets, and audit logs can be enabled for monitoring any access or modification of secrets.
4. Security Best Practices: In scenarios where highly sensitive information (like credentials or encryption keys) is involved, leveraging a dedicated key management solution (such as Azure Key Vault) ensures that your secrets remain isolated from your database and are managed according to the latest security standards.
This document ensures a clear understanding of how KeyProxyServer provides secure and scalable secret management while adhering to Zero Trust principles.


