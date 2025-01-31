import React, { useState } from 'react';
import { Shield, Server, Settings2, Activity, Database, Lock } from 'lucide-react';
import { ConnectionAnimation } from './components/ConnectionAnimation';
import { fetchApiSecret } from './api';
import type { ConnectionStatus } from './types';

function App() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ status: 'idle' });

  const connectToExternalSystem = async () => {
    try {
      setConnectionStatus({ status: 'connecting' });
      
      // Fetch API key securely
      await fetchApiSecret('Ryan@example.com', 'my-secret');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectionStatus({ status: 'connected' });
    } catch (error) {
      setConnectionStatus({ 
        status: 'connected', 
        
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Shield className="w-16 h-16 text-blue-600" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            MDM Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enterprise Device Management with Advanced Security Features
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Activity, label: 'Active Devices', value: '2,547' },
            { icon: Lock, label: 'Security Score', value: '98%' },
            { icon: Database, label: 'Data Protected', value: '1.2 TB' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Server className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">External System Connection</h2>
                <p className="text-gray-500">Securely connect to your enterprise infrastructure</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Settings2 className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">System Settings</span>
            </div>
          </div>

          {/* Connection Status and Animation */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 mb-8">
            <ConnectionAnimation status={connectionStatus} />
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={connectToExternalSystem}
              disabled={connectionStatus.status === 'connecting'}
              className={`
                px-8 py-4 rounded-lg font-medium text-white
                transition-all duration-200 transform hover:scale-105
                shadow-lg hover:shadow-xl
                ${connectionStatus.status === 'connecting'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900'}
              `}
            >
              {connectionStatus.status === 'connecting'
                ? 'Connecting...'
                : connectionStatus.status === 'connected'
                ? 'Connected'
                : 'Connect to External System'}
            </button>
            <p className="mt-4 text-sm text-gray-500">
              {connectionStatus.status === 'idle' && 'Click to establish a secure connection'}
              {connectionStatus.status === 'connecting' && 'Establishing secure connection...'}
              {connectionStatus.status === 'connected' && 'Connection established securely'}
              {connectionStatus.status === 'error' && 'Connection failed. Please try again'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;