import React from 'react';
import { TrendingUp, Check, Heart, Droplets } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: TrendingUp,
      description: 'Overview & insights'
    },
    {
      id: 'habits',
      label: 'Habit Tracker',
      icon: Check,
      description: 'Manage daily habits'
    },
    {
      id: 'mood',
      label: 'Mood Journal',
      icon: Heart,
      description: 'Track your emotions'
    },
    {
      id: 'hydration',
      label: 'Hydration',
      icon: Droplets,
      description: 'Water intake reminders'
    }
  ];

  return (
    <nav className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 sticky top-24">
      <div className="space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-green-50 border-green-200 border text-green-700'
                : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeTab === item.id
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm opacity-75">{item.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;