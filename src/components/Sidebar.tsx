import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  AlertCircle, 
  LayoutDashboard, 
  Settings as SettingsIcon,
  Code2,
  Users,
  Bell,
  Boxes,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'All Errors', icon: AlertCircle, href: '/errors' },
  { name: 'Integration', icon: Code2, href: '/integration' },
  { name: 'Team', icon: Users, href: '/team' },
  { name: 'Alerts', icon: Bell, href: '/alerts' },
  { name: 'Projects', icon: Boxes, href: '/projects' },
  { name: 'Settings', icon: SettingsIcon, href: '/settings' },
];

export function Sidebar() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-64 bg-black border-r border-[#1a1a1a] flex flex-col">
      <div className="p-4 border-b border-[#1a1a1a]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">TracelQ</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-500'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.email?.split('@')[0]}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}