import React, { useState, useEffect } from 'react';
import { Settings, Edit2, Save, X } from 'lucide-react';
import SuccessModal from '../components/SuccessModal';

interface KMSConfig {
  provider: string;
  credentials: {
    [key: string]: string;
  };
}

const KMSConfig = () => {
  const [config, setConfig] = useState<KMSConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedConfig, setEditedConfig] = useState<KMSConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<'success' | 'error'>('success');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    // Simulated API call to fetch KMS configuration
    fetchKMSConfig();
  }, []);

  const fetchKMSConfig = () => {
    // Simulated API response
    const mockConfig = {
      provider: 'azure',
      credentials: {
        vaultUrl: 'https://example.vault.azure.net',
        clientId: 'mock-client-id',
        tenantId: 'mock-tenant-id',
      },
    };
    setConfig(mockConfig);
    setEditedConfig(mockConfig);
  };

  const handleInputChange = (field: string, value: string) => {
    if (editedConfig) {
      setEditedConfig({
        ...editedConfig,
        credentials: {
          ...editedConfig.credentials,
          [field]: value,
        },
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Simulated API call to update configuration
      // In reality, this would be a call to your Python backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success (90% of the time)
      if (Math.random() > 0.1) {
        setConfig(editedConfig);
        setModalStatus('success');
        setModalMessage('KMS configuration updated successfully');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update KMS configuration');
      }
    } catch (error) {
      setModalStatus('error');
      setModalMessage('Failed to update KMS configuration. Please try again.');
    }
    setShowModal(true);
  };

  const renderCredentialFields = () => {
    if (!editedConfig) return null;

    const fields = Object.entries(editedConfig.credentials);
    return fields.map(([key, value]) => (
      <div key={key} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
        </label>
        <input
          type={key.toLowerCase().includes('key') || key.toLowerCase().includes('secret') ? 'password' : 'text'}
          value={value}
          onChange={(e) => handleInputChange(key, e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800"
        />
      </div>
    ));
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KMS Configuration</h1>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Configuration</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedConfig(config);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Provider Information
            </h3>
            <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Current Provider: <span className="font-semibold">{config.provider.toUpperCase()}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Credentials
            </h3>
            {renderCredentialFields()}
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        status={modalStatus}
        message={modalMessage}
      />
    </div>
  );
};

export default KMSConfig;