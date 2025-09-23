import React, { useState } from 'react';
import { X, Dog, Calendar, MapPin, DollarSign, FileText, Sparkles } from 'lucide-react';
import { SERVICE_TYPES, NEIGHBORHOODS } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface NewRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestData: any) => void;
}

const NewRequestForm: React.FC<NewRequestFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{
    serviceType?: string;
    date?: string;
    time?: string;
    additionalInfo?: string;
    neighborhood?: string;
    specialInstructions?: string;
    offeredPrice?: string;
    checkbox?: string;
  }>({});
  
  // Initialize form data function
  const initializeFormData = () => ({
    serviceType: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    time: new Date().toTimeString().slice(0, 5), // Current time (HH:MM)
    dogName: user?.dogName || '',
    dogBreed: user?.dogBreed || '',
    dogAge: user?.dogAge || 0,
    dogImage: user?.dogImage || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalInfo: user?.dogInfo || '',
    neighborhood: user?.neighborhood || '',
    specialInstructions: '',
    offeredPrice: '',
    flexible: false,
    agreeToTerms: false
  });
  
  const [formData, setFormData] = useState(initializeFormData);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData(initializeFormData());
      setStep(1);
      setErrors({});
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Validation functions
  const validateServiceType = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'סוג השירות הוא שדה חובה';
    }
    if (value.trim().length < 3 || value.trim().length > 50) {
      return 'סוג השירות חייב להיות בין 3-50 תווים';
    }
    // Check if only numbers
    if (/^\d+$/.test(value.trim())) {
      return 'סוג השירות לא יכול להיות מספר בלבד';
    }
    // Check if only symbols
    if (/^[^\w\s\u0590-\u05FF]+$/.test(value.trim())) {
      return 'סוג השירות לא יכול להיות סמלים בלבד';
    }
    return undefined;
  };

  const validateDate = (value: string): string | undefined => {
    if (!value) {
      return 'תאריך הוא שדה חובה';
    }
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'לא ניתן לבחור תאריך עבר';
    }
    return undefined;
  };

  const validateTime = (timeValue: string, dateValue: string): string | undefined => {
    if (!timeValue) {
      return 'שעה היא שדה חובה';
    }
    
    // Check time format
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeValue)) {
      return 'פורמט שעה לא תקין (HH:MM)';
    }
    
    if (dateValue) {
      const selectedDate = new Date(dateValue);
      const today = new Date();
      
      // If selected date is today, check if time is not in the past
      if (selectedDate.toDateString() === today.toDateString()) {
        const [hours, minutes] = timeValue.split(':').map(Number);
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(hours, minutes, 0, 0);
        
        if (selectedDateTime <= new Date()) {
          return 'לא ניתן לבחור שעה עברה';
        }
      }
    }
    
    return undefined;
  };

  const validateAdditionalInfo = (value: string): string | undefined => {
    if (value.length > 200) {
      return 'מידע נוסף לא יכול להיות יותר מ-200 תווים';
    }
    return undefined;
  };

  const validateNeighborhood = (value: string): string | undefined => {
    if (!value) {
      return 'שכונה היא שדה חובה';
    }
    return undefined;
  };

  const validateSpecialInstructions = (value: string): string | undefined => {
    if (value.length > 200) {
      return 'הוראות מיוחדות לא יכולות להיות יותר מ-200 תווים';
    }
    return undefined;
  };

  const validateOfferedPrice = (value: string): string | undefined => {
    if (!value) {
      return 'מחיר הוא שדה חובה';
    }
    const price = parseInt(value);
    if (isNaN(price) || price <= 0) {
      return 'מחיר חייב להיות מספר חיובי';
    }
    if (price < 20 || price > 500) {
      return 'מחיר חייב להיות בין 20-500 ₪';
    }
    return undefined;
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: typeof errors = {};
    
    switch (stepNumber) {
      case 1:
        newErrors.serviceType = validateServiceType(formData.serviceType);
        newErrors.date = validateDate(formData.date);
        newErrors.time = validateTime(formData.time, formData.date);
        break;
      case 2:
        newErrors.additionalInfo = validateAdditionalInfo(formData.additionalInfo);
        break;
      case 3:
        newErrors.neighborhood = validateNeighborhood(formData.neighborhood);
        newErrors.specialInstructions = validateSpecialInstructions(formData.specialInstructions);
        break;
      case 4:
        newErrors.offeredPrice = validateOfferedPrice(formData.offeredPrice);
        break;
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleNext = () => {
    if (validateStep(step) && step < 5) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Final validation
    if (validateStep(4) && formData.agreeToTerms) {
      onSubmit(formData);
      onClose();
      // Reset form after submission
      setFormData(initializeFormData());
      setStep(1);
      setErrors({});
    } else if (!formData.agreeToTerms) {
      setErrors({ checkbox: 'חובה לאשר את התנאים' });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2 sm:gap-3 text-gray-800 mobile-text-xl">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-md sm:rounded-lg flex items-center justify-center">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        פרטי השירות
      </h3>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">סוג שירות</label>
        <input
          type="text"
          value={formData.serviceType}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, serviceType: e.target.value }));
            setErrors(prev => ({ ...prev, serviceType: undefined }));
          }}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
          placeholder="תאר את השירות שאתה מעוניין לקבל"
          required
          maxLength={50}
        />
        {errors.serviceType && (
          <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>
        )}
        <p className="text-xs text-orange-600 mt-2">
          חשוב להסביר בפירוט את הצורך שלך - לדוגמה: "הליכה של 30 דקות בפארק", "שמירה בבית למשך 4 שעות", "ביקור יומי לאכלה"
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mobile-grid-2">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">תאריך</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, date: e.target.value }));
              setErrors(prev => ({ ...prev, date: undefined, time: undefined }));
            }}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
            required
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">שעה</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, time: e.target.value }));
              setErrors(prev => ({ ...prev, time: undefined }));
            }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
            required
          />
          {errors.time && (
            <p className="text-red-500 text-xs mt-1">{errors.time}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-xl flex items-center gap-3 text-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg flex items-center justify-center">
          <Dog className="w-4 h-4 text-white" />
        </div>
        פרטי הכלב
      </h3>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">שם הכלב</label>
          <input
            type="text"
            value={formData.dogName}
            onChange={(e) => setFormData(prev => ({ ...prev, dogName: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-xl text-gray-600"
            disabled
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">גזע</label>
          <input
            type="text"
            value={formData.dogBreed}
            onChange={(e) => setFormData(prev => ({ ...prev, dogBreed: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-xl text-gray-600"
            disabled
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">גיל</label>
          <input
            type="number"
            min="0"
            max="25"
            value={formData.dogAge}
            onChange={(e) => setFormData(prev => ({ ...prev, dogAge: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-xl text-gray-600"
            disabled
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">מידע נוסף</label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, additionalInfo: e.target.value }));
              setErrors(prev => ({ ...prev, additionalInfo: undefined }));
            }}
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm resize-none"
            placeholder="מידע נוסף על הכלב..."
          />
          {errors.additionalInfo && (
            <p className="text-red-500 text-xs mt-1">{errors.additionalInfo}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.additionalInfo.length}/200 תווים
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-xl flex items-center gap-3 text-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        מיקום והוראות
      </h3>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">שכונה</label>
        <select
          value={formData.neighborhood}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, neighborhood: e.target.value }));
            setErrors(prev => ({ ...prev, neighborhood: undefined }));
          }}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
          required
        >
          <option value="">בחר שכונה</option>
          {NEIGHBORHOODS.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
          ))}
        </select>
        {errors.neighborhood && (
          <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">הוראות מיוחדות</label>
        <textarea
          value={formData.specialInstructions}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, specialInstructions: e.target.value }));
            setErrors(prev => ({ ...prev, specialInstructions: undefined }));
          }}
          rows={4}
          maxLength={200}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm resize-none"
          placeholder="הוראות מיוחדות לסיטר (עד 200 תווים)..."
        />
        {errors.specialInstructions && (
          <p className="text-red-500 text-xs mt-1">{errors.specialInstructions}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {formData.specialInstructions.length}/200 תווים
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-xl flex items-center gap-3 text-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-white" />
        </div>
        תמחור וביטול
      </h3>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">מחיר שאני מוכן לשלם (₪)</label>
        <input
          type="number"
          min="20"
          max="500"
          value={formData.offeredPrice}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, offeredPrice: e.target.value }));
            setErrors(prev => ({ ...prev, offeredPrice: undefined }));
          }}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
          placeholder="הכנס את המחיר שאתה מוכן לשלם"
          required
        />
        {errors.offeredPrice && (
          <p className="text-red-500 text-xs mt-1">{errors.offeredPrice}</p>
        )}
        <p className="text-xs text-orange-600 mt-2">המחיר שתציין יעזור לסיטרים להבין את התקציב שלך (20-500 ₪)</p>
      </div>

      <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
        <h4 className="font-semibold text-yellow-900 mb-3">מדיניות ביטול</h4>
        <div className="text-sm text-yellow-800 space-y-2">
          <p>• ביטול עד 24 שעות לפני השירות - ללא עמלה</p>
          <p>• ביטול עד 2 שעות לפני השירות - עמלת ביטול של 50%</p>
          <p>• ביטול פחות מ-2 שעות לפני השירות - חיוב מלא</p>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-xl text-gray-800">סיכום ואישור</h3>
      
      <div className="space-y-6">
        <div className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-200">
          <h4 className="font-semibold text-orange-900 mb-3">פרטי השירות</h4>
          <div className="text-orange-800 space-y-1">
            <p><strong>סוג שירות:</strong> {formData.serviceType}</p>
            <p><strong>תאריך ושעה:</strong> {new Date(formData.date).toLocaleDateString('he-IL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {formData.time}</p>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl border border-pink-200">
          <h4 className="font-semibold text-pink-900 mb-3">פרטי הכלב</h4>
          <div className="text-pink-800 space-y-1">
            <p><strong>שם:</strong> {formData.dogName}</p>
            <p><strong>גזע:</strong> {formData.dogBreed}</p>
            <p><strong>גיל:</strong> {formData.dogAge} שנים</p>
            {formData.additionalInfo && (
              <p><strong>מידע נוסף:</strong> {formData.additionalInfo}</p>
            )}
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">מיקום והוראות</h4>
          <div className="text-blue-800 space-y-1">
            <p><strong>שכונה:</strong> {formData.neighborhood}</p>
            {formData.specialInstructions && (
              <p><strong>הוראות מיוחדות:</strong> {formData.specialInstructions}</p>
            )}
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3">מחיר</h4>
          <div className="text-green-800">
            <p><strong>המחיר שאני מוכן לשלם:</strong> ₪{formData.offeredPrice}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
        <input
          type="checkbox"
          id="confirm"
          checked={formData.agreeToTerms}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }));
            setErrors(prev => ({ ...prev, checkbox: undefined }));
          }}
          required
          className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
        />
        <label htmlFor="confirm" className="text-gray-700 font-medium">
          אני מאשר שהפרטים נכונים ומסכים לתנאי השימוש
        </label>
      </div>
      {errors.checkbox && (
        <p className="text-red-500 text-xs mt-1">{errors.checkbox}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl max-w-sm sm:max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 mobile-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-pink-50">
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">בקשה חדשה</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded-lg sm:rounded-xl transition-all duration-200"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-50 to-pink-50">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
            <span>שלב {step} מתוך 5</span>
            <span className="font-semibold">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-2 sm:h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 mobile-modal-content">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        {/* Footer */}
        <div className="flex gap-3 sm:gap-4 p-4 sm:p-6 border-t border-orange-100 bg-gradient-to-r from-orange-50 to-pink-50">
          {step > 1 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-2.5 sm:py-3 border-2 border-orange-200 rounded-lg sm:rounded-xl hover:bg-white transition-all font-medium shadow-sm hover:shadow-md text-sm sm:text-base mobile-button"
            >
              הקודם
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-sm sm:text-base mobile-button"
            >
              הבא
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base mobile-button"
            >
              פרסם בקשה
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewRequestForm;