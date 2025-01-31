import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import AddSecret from './pages/AddSecret';
import ViewSecrets from './pages/ViewSecrets';
import KeyManagement from './pages/KeyManagement';
import AuditLogs from './pages/AuditLogs';
import KMSConfig from './pages/KMSConfig';
import { Activity, Key, Shield, AlertTriangle } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [currentPage, setCurrentPage] = useState('/dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [kmsStatus, setKmsStatus] = useState<'connected' | 'not_connected'>('not_connected');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Simulated API call to check KMS connection status
    checkKMSStatus();
  }, []);

  const checkKMSStatus = () => {
    // Simulated API call
    // In reality, this would be a call to your Python backend
    setTimeout(() => {
      setKmsStatus(Math.random() > 0.5 ? 'connected' : 'not_connected');
    }, 1000);
  };

  const renderContent = () => {
    switch (currentPage) {
      case '/secrets/add':
        return <AddSecret />;
      case '/secrets/view':
        return <ViewSecrets />;
      case '/kms':
        return <KeyManagement />;
      case '/kms-config':
        return <KMSConfig />;
      case '/audit':
        return <AuditLogs />;
      default:
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Total Secrets</h2>
                  <Key className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-3xl font-bold">128</p>
                <p className="text-sm opacity-80 mt-2">+12 this week</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">KMS Status</h2>
                  <Shield className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-3xl font-bold">
                  {kmsStatus === 'connected' ? 'Connected' : 'Not Connected'}
                </p>
                <p className="text-sm opacity-80 mt-2">
                  {kmsStatus === 'connected' ? 'System operational' : 'Check configuration'}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">API Requests</h2>
                  <Activity className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-3xl font-bold">2.4k</p>
                <p className="text-sm opacity-80 mt-2">Last 24 hours</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Security Alerts</h2>
                  <AlertTriangle className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-3xl font-bold">2</p>
                <p className="text-sm opacity-80 mt-2">Requires attention</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    { action: 'New secret created', time: '2 minutes ago', type: 'create' },
                    { action: 'Key rotation completed', time: '1 hour ago', type: 'update' },
                    { action: 'Secret accessed by API', time: '3 hours ago', type: 'access' },
                    { action: 'New API key generated', time: '5 hours ago', type: 'create' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'create' ? 'bg-green-500' :
                          activity.type === 'update' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-gray-700 dark:text-gray-300">{activity.action}</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Key Health Status</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Production API Keys', health: 98, status: 'Healthy' },
                    { name: 'Development Keys', health: 100, status: 'Optimal' },
                    { name: 'Database Encryption', health: 85, status: 'Good' },
                    { name: 'Backup Keys', health: 100, status: 'Optimal' },
                  ].map((key, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">{key.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{key.status}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              key.health > 90 ? 'bg-green-500' :
                              key.health > 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${key.health}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{key.health}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors`}>
      <Sidebar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} p-8`}>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        {renderContent()}
      </main>
    </div>
  );
}

export default App;