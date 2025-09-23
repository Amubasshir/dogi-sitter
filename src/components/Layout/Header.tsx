import React from 'react';
import { Search, Settings, Bell, ArrowRight, Heart, LogIn, User, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  showSettings?: boolean;
  showNotifications?: boolean;
  showBack?: boolean;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  onBackClick?: () => void;
  title?: string;
  onAuthClick?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showSettings = false,
  showNotifications = false,
  showBack = false,
  onSettingsClick,
  onNotificationsClick,
  onBackClick,
  title,
  onAuthClick,
  onProfileClick
}) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <div className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-orange-100 px-3 py-3 sticky top-0 z-40 mobile-safe-top">
      <div className="flex items-center justify-between">
        {/* Left - Logo (optional) */}
        <div className="w-12 flex justify-start">
          {!showBack && (
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg float-animation">
              <Heart className="w-6 h-6 text-white" />
            </div>
          )}
          {showBack && (
            <button
              onClick={onBackClick}
              className="p-3 hover:bg-orange-50 rounded-2xl transition-all border border-orange-100 min-w-[48px] min-h-[48px] flex items-center justify-center"
            >
              <ArrowRight className="w-6 h-6 text-orange-600" />
            </button>
          )}
        </div>

        {/* Center - App Name */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {title || 'דוגיסיטר'}
          </h1>
        </div>

        {/* Right - Action Icons */}
        <div className="flex items-center gap-1">
          {/* Login/Profile */}
          {!isAuthenticated ? (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all text-sm shadow-lg min-h-[44px]"
            >
              <LogIn className="w-5 h-5" />
              <span>התחבר</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              {/* Profile Button */}
              <button
                onClick={onProfileClick}
                className="flex items-center gap-1 px-2 py-2 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all text-xs shadow-md border border-orange-200 min-h-[44px]"
              >
                <UserCircle className="w-5 h-5 text-orange-600" />
                <span className="text-orange-700 font-medium hidden sm:inline">פרופיל</span>
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-2 hover:bg-orange-50 rounded-xl transition-all border border-orange-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50"
                    />
                  ) : (
                    <User className="w-6 h-6 text-orange-600" />
                  )}
                </button>

                {showProfileMenu && (
                  <div className="absolute left-0 mt-1 w-44 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-orange-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-orange-100">
                      <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.userType === 'client' ? 'בעל כלב' : 'סיטר'}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full text-right px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-red-600 transition-all text-sm min-h-[44px]"
                    >
                      <LogOut className="w-5 h-5" />
                      התנתק
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other Actions */}
          {showSettings && (
            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-orange-50 rounded-xl transition-all border border-orange-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Settings className="w-6 h-6 text-orange-600" />
            </button>
          )}
          {showNotifications && isAuthenticated && (
            <button
              onClick={onNotificationsClick}
              className="p-2 hover:bg-orange-50 rounded-xl transition-all relative border border-orange-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Bell className="w-6 h-6 text-orange-600" />
              {/* Notification badge */}
              <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full pulse-glow shadow-lg"></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;