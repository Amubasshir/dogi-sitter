import React from 'react';
import { FileText, Users, Store } from 'lucide-react';

interface TopNavigationProps {
  activeTab: 'requests' | 'sitters' | 'businesses';
  onTabChange: (tab: 'requests' | 'sitters' | 'businesses') => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'requests' as const,
      icon: FileText,
      label: 'בקשות',
      emoji: '🏠'
    },
    {
      id: 'sitters' as const,
      icon: Users,
      label: 'סיטרים',
      emoji: '👥'
    },
    {
      id: 'businesses' as const,
      icon: Store,
      label: 'עסקים',
      emoji: '🏪'
    }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl border-b border-orange-100 px-2 py-3 sticky top-16 z-30 shadow-sm">
      <div className="flex items-center justify-center gap-1 max-w-sm mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-all duration-300 min-w-0 shadow-md hover:shadow-lg transform hover:scale-105 min-h-[56px] flex-1 ${
                isActive
                  ? 'text-white bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50 bg-white border border-orange-100'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg"></div>
                )}
              </div>
              <span className={`text-xs font-medium truncate leading-tight ${
                isActive ? 'text-white' : 'text-gray-600'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopNavigation;