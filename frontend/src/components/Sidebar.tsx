import React from 'react';
import {
  LayoutDashboard,
  Key,
  Shield,
  ClipboardList,
  LineChart,
  LifeBuoy,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  submenu?: { title: string; path: string }[];
}

interface SidebarProps {
  onNavigate: (path: string) => void;
  currentPage: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/dashboard',
  },
  {
    title: 'Secrets Management',
    icon: <Key className="w-5 h-5" />,
    path: '/secrets',
    submenu: [
      { title: 'View Secrets', path: '/secrets/view' },
      { title: 'Add Secret', path: '/secrets/add' },
    ],
  },
  {
    title: 'Key Management',
    icon: <Shield className="w-5 h-5" />,
    path: '/kms',
  },
  {
    title: 'KMS Configuration',
    icon: <Settings className="w-5 h-5" />,
    path: '/kms-config',
  },
  {
    title: 'Audit Logs',
    icon: <ClipboardList className="w-5 h-5" />,
    path: '/audit',
  },
  {
    title: 'Monitoring',
    icon: <LineChart className="w-5 h-5" />,
    path: '/monitoring',
  },
  {
    title: 'Help & Support',
    icon: <LifeBuoy className="w-5 h-5" />,
    path: '/support',
  },
  {
    title: 'Documentation',
    icon: <BookOpen className="w-5 h-5" />,
    path: '/docs',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage, isExpanded, onToggleExpand }) => {
  return (
    <div
      className={`${
        isExpanded ? 'w-64' : 'w-20'
      } h-screen bg-gray-900 text-white transition-all duration-300 fixed left-0 top-0 overflow-y-auto`}
    >
      {/* Logo Section */}
      <div className="flex items-center p-4 border-b border-gray-800">
        {isExpanded ? (
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="font-bold text-lg">Customer Portal</span>
          </div>
        ) : (
          <Shield className="w-8 h-8 text-blue-500 mx-auto" />
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggleExpand}
        className="absolute -right-3 top-10 bg-gray-900 text-white p-1 rounded-full"
      >
        {isExpanded ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* Menu Items */}
      <div className="py-4">
        {menuItems.map((item) => (
          <div key={item.path}>
            <button
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${
                currentPage.startsWith(item.path) ? 'bg-gray-800' : ''
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'space-x-4' : 'justify-center'}`}>
                {item.icon}
                {isExpanded && <span>{item.title}</span>}
              </div>
            </button>
            {isExpanded && item.submenu && currentPage.startsWith(item.path) && (
              <div className="ml-8 mt-2">
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.path}
                    onClick={() => onNavigate(subItem.path)}
                    className={`w-full text-left py-2 px-4 text-sm ${
                      currentPage === subItem.path
                        ? 'text-white bg-gray-800'
                        : 'text-gray-400 hover:text-white'
                    } transition-colors`}
                  >
                    {subItem.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Logout Button */}
        <button className="w-full flex items-center px-4 py-3 hover:bg-gray-800 text-red-400 hover:text-red-300 transition-colors mt-4">
          <div className={`flex items-center ${isExpanded ? 'space-x-4' : 'justify-center'}`}>
            <LogOut className="w-5 h-5" />
            {isExpanded && <span>Logout</span>}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;