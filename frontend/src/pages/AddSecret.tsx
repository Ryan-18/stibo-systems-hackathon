import React, { useState } from 'react';
import { Key } from 'lucide-react';
import SuccessModal from '../components/SuccessModal';

const secretTypes = [
  'API Key',
  'Encryption Key',
  'Password',
  'Database Credential',
  'Certificate',
  'Token',
];

const AddSecret = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    value: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<'success' | 'error'>('success');
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/create-secret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'Ryan@example.com', // Hardcoded email
          secret_name: formData.name,
          secret_value: formData.value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create secret');
      }

      const result = await response.json();

      setModalStatus('success');
      setModalMessage('Secret has been successfully created and encrypted.');
    } catch (error) {
      setModalStatus('error');
      setModalMessage(error instanceof Error ? error.message : 'Failed to create secret. Please try again.');
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (modalStatus === 'success') {
      setFormData({
        name: '',
        type: '',
        value: '',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Key className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Secret</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secret Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter a unique identifier for the secret"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secret Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select a type</option>
              {secretTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secret Value
            </label>
            <input
              type="password"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter the secret value"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setFormData({ name: '', type: '', value: '' })}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Secret'}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={showModal}
        onClose={handleModalClose}
        status={modalStatus}
        message={modalMessage}
      />
    </div>
  );
};

export default AddSecret;
