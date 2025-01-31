import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MoreVertical, Eye, EyeOff, Edit2, Trash2, Key } from 'lucide-react';
import SuccessModal from '../components/SuccessModal';

interface Secret {
  id: string;
  name: string;
  type: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

const ViewSecrets = () => {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [editingSecret, setEditingSecret] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalStatus, setSuccessModalStatus] = useState<'success' | 'error'>('success');
  const [successModalMessage, setSuccessModalMessage] = useState('');

  // Fetch secrets from the backend
  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-all-secrets', {
          params: { email: 'Ryan@example.com' }
        });

        const formattedSecrets = response.data.secrets.map((secret: any, index: number) => ({
          id: String(index + 1), // Assigning a temporary ID
          name: secret.secret_name,
          type: 'Unknown', // Default value since the API doesn’t provide a type
          value: secret.secret_value,
          createdAt: secret.created_time,
          updatedAt: secret.created_time // Using created_time for updatedAt as well
        }));

        setSecrets(formattedSecrets);
      } catch (error) {
        console.error('Error fetching secrets:', error);
      }
    };

    fetchSecrets();
  }, []);

  const toggleSecretVisibility = (id: string) => {
    setVisibleSecrets(prev => {
      const newVisibleSecrets = new Set(prev);
      newVisibleSecrets.has(id) ? newVisibleSecrets.delete(id) : newVisibleSecrets.add(id);
      return newVisibleSecrets;
    });
  };

  const startEditing = (secret: Secret) => {
    setEditingSecret(secret.id);
    setEditValue(secret.value);
    setShowModal(false);
  };

  const saveEdit = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSecrets(secrets.map(secret =>
        secret.id === id
          ? { ...secret, value: editValue, updatedAt: new Date().toISOString() }
          : secret
      ));
      setSuccessModalStatus('success');
      setSuccessModalMessage('Secret updated successfully');
    } catch (error) {
      setSuccessModalStatus('error');
      setSuccessModalMessage('Failed to update secret. Please try again.');
    }

    setShowSuccessModal(true);
    setEditingSecret(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center space-x-3 mb-6">
        <Key className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Secrets Management</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Secret Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {secrets.map((secret) => (
                <tr key={secret.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{secret.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{secret.type}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {editingSecret === secret.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                        <button onClick={() => saveEdit(secret.id)} className="text-green-500 hover:text-green-600">
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">
                          {visibleSecrets.has(secret.id) ? secret.value : '••••••••••••••••'}
                        </span>
                        <button onClick={() => toggleSecretVisibility(secret.id)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          {visibleSecrets.has(secret.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{formatDate(secret.createdAt)}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{formatDate(secret.updatedAt)}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                    <button onClick={() => setSelectedSecret(secret)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success/Error Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} status={successModalStatus} message={successModalMessage} />
    </div>
  );
};

export default ViewSecrets;
