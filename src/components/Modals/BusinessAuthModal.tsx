import React, { useState } from 'react';
import { X, Building, LogIn, UserPlus, Sparkles } from 'lucide-react';

interface BusinessAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BusinessAuthModal: React.FC<BusinessAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'choice' | 'login' | 'register'>('choice');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: ''
  });

  if (!isOpen) return null;

  const handleLogin = () => {
    // Mock login - in real app, this would be an API call
    console.log('Business login:', formData);
    onSuccess?.();
    onClose();
    resetForm();
  };

  const handleRegister = () => {
    // Open business registration form
    onClose();
    setTimeout(() => {
      const event = new CustomEvent('openBusinessRegistration');
      window.dispatchEvent(event);
    }, 100);
  };

  const resetForm = () => {
    setStep('choice');
    setFormData({ email: '', password: '', businessName: '' });
  };

  const renderChoice = () => (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg float-animation">
          <Building className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2 sm:mb-3">
          עסקים בדוגיסיטר
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">הצטרף לקהילת העסקים שלנו</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <button
          onClick={handleRegister}
          className="w-full p-6 sm:p-8 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl sm:rounded-2xl hover:border-orange-400 hover:bg-orange-50 hover:shadow-xl transition-all duration-300 group transform hover:scale-105"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-green-500 group-hover:to-emerald-500 transition-all shadow-lg">
              <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2">הרשמת עסק חדש</h3>
              <p className="text-gray-600 text-sm sm:text-base">פרסם את העסק שלך ותגיע ללקוחות חדשים</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setStep('login')}
          className="w-full p-6 sm:p-8 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl sm:rounded-2xl hover:border-orange-400 hover:bg-orange-50 hover:shadow-xl transition-all duration-300 group transform hover:scale-105"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-orange-500 group-hover:to-pink-500 transition-all shadow-lg">
              <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2">התחברות עסק קיים</h3>
              <p className="text-gray-600 text-sm sm:text-base">כבר רשום? התחבר לניהול העסק שלך</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
          <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          התחברות עסק
        </h2>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">אימייל עסקי</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base"
            placeholder="business@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">סיסמה</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base"
            placeholder="••••••••"
          />
        </div>

        <div className="text-center">
          <button className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-sm">
            שכחתי סיסמה
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
        >
          התחבר לניהול העסק
        </button>
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <button
          onClick={() => setStep('choice')}
          className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-sm sm:text-base"
        >
          חזור לתפריט הראשי
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl max-w-sm sm:max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-pink-50">
          <div className="w-6" />
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            דוגיסיטר עסקים
          </h1>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded-lg sm:rounded-xl transition-all duration-200"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div>
          {step === 'choice' && renderChoice()}
          {step === 'login' && renderLogin()}
        </div>
      </div>
    </div>
  );
};

export default BusinessAuthModal;