import React, { useState } from 'react';
import { Shield, Mail, Lock, Building, Phone, User, Upload } from 'lucide-react';

interface KMSCredentials {
  aws?: {
    access_key_id: string;
    secret_access_key: string;
    region: string;
  };
  gcp?: {
    service_account_json: string;
  };
  hsm?: {
    hsm_url: string;
    client_certificate: string;
    private_key: string;
    auth_token: string;
  };
}

const encryptionAlgorithms = [
  'AES-256-GCM',
  'AES-256-CBC',
  'RSA-2048',
  'RSA-4096',
  'ChaCha20-Poly1305',
  'ED25519',
];

const API_URL = 'http://localhost:5000'; // Update with your server URL

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    phone_number: '',
    email: '',
    password: '',
    confirm_password: '',
    kms_selection: 'azure',
    security_preferences: {
      encryption_algorithm: '',
      access_control: 'rbac'
    }
  });
  const [kmsCredentials, setKmsCredentials] = useState<KMSCredentials>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('security_preferences')) {
      const prefField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        security_preferences: {
          ...prev.security_preferences,
          [prefField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (event.target?.result) {
          const content = btoa(event.target.result as string);
          setKmsCredentials(prev => ({
            ...prev,
            gcp: { service_account_json: content }
          }));
        }
      };
      
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login logic
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        // Signup logic
        if (formData.password !== formData.confirm_password) {
          throw new Error('Passwords do not match');
        }

        const payload = {
          ...formData,
          kms_credentials: kmsCredentials[formData.kms_selection as keyof KMSCredentials]
        };

        const response = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setIsLogin(true); // Switch to login after successful signup
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderKMSFields = () => {
    switch(formData.kms_selection) {
      case 'aws':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Access Key ID"
              className="w-full px-4 py-2 border rounded-md"
              onChange={e => setKmsCredentials(prev => ({
                ...prev,
                aws: { ...prev.aws, access_key_id: e.target.value }
              }))}
            />
            <input
              type="password"
              placeholder="Secret Access Key"
              className="w-full px-4 py-2 border rounded-md"
              onChange={e => setKmsCredentials(prev => ({
                ...prev,
                aws: { ...prev.aws, secret_access_key: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="Region"
              className="w-full px-4 py-2 border rounded-md"
              onChange={e => setKmsCredentials(prev => ({
                ...prev,
                aws: { ...prev.aws, region: e.target.value }
              }))}
            />
          </div>
        );
      
      case 'gcp':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-4 border-2 border-dashed rounded-md">
              <Upload className="w-5 h-5 text-gray-400" />
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="serviceAccountJson"
                accept=".json"
              />
              <label
                htmlFor="serviceAccountJson"
                className="cursor-pointer text-sm text-gray-600"
              >
                Upload Service Account JSON
              </label>
            </div>
          </div>
        );

      case 'hsm':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="HSM URL"
              className="w-full px-4 py-2 border rounded-md"
              onChange={e => setKmsCredentials(prev => ({
                ...prev,
                hsm: { ...prev.hsm, hsm_url: e.target.value }
              }))}
            />
            <input
              type="text"
              placeholder="Client Certificate"
              className="w-full px-4 py-2 border rounded-md"
              onChange={e => setKmsCredentials(prev => ({
                ...prev,
                hsm: { ...prev.hsm, client_certificate: e.target.value }
              }))}
            />
            <input
              type="password"
              placeholder="Private Key"
              className="w-full px-4 py-2 border rounded-md"
              onChange={e => setKmsCredentials(prev => ({
                ...prev,
                hsm: { ...prev.hsm, private_key: e.target.value }
              }))}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <Shield className="mx-auto h-12 w-12 text-blue-500" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Customer Portal
            </h2>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 rounded-full p-1">
              <div className="flex">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isLogin ? 'bg-blue-500 text-white' : 'text-gray-500'
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    !isLogin ? 'bg-blue-500 text-white' : 'text-gray-500'
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}

            {!isLogin && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="company_name"
                      placeholder="Company Name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="contact_name"
                      placeholder="Contact Name"
                      value={formData.contact_name}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone_number"
                      placeholder="Phone Number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">KMS Configuration</h3>
                  <select
                    name="kms_selection"
                    value={formData.kms_selection}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md"
                    required
                  >
                    <option value="azure">Azure</option>
                    <option value="aws">AWS</option>
                    <option value="gcp">GCP</option>
                    <option value="hsm">On-Prem HSM</option>
                  </select>

                  {renderKMSFields()}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Preferences</h3>
                  <select
                    name="security_preferences.encryption_algorithm"
                    value={formData.security_preferences.encryption_algorithm}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select Encryption Algorithm</option>
                    {encryptionAlgorithms.map(algo => (
                      <option key={algo} value={algo}>{algo}</option>
                    ))}
                  </select>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="security_preferences.access_control"
                        value="rbac"
                        checked={formData.security_preferences.access_control === 'rbac'}
                        onChange={handleInputChange}
                        className="form-radio"
                      />
                      <span>Role-Based Access</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="security_preferences.access_control"
                        value="mfa"
                        checked={formData.security_preferences.access_control === 'mfa'}
                        onChange={handleInputChange}
                        className="form-radio"
                      />
                      <span>Multi-Factor Auth</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border rounded-md"
                  required
                />
              </div>
              {!isLogin && (
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border rounded-md"
                    required
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;