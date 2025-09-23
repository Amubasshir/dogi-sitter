import React from 'react';
import { X, Clock, MapPin, DollarSign, Dog, User, MessageCircle, CheckCircle, Calendar } from 'lucide-react';
import { Request, SERVICE_TYPES, DOG_SIZES } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface RequestDetailsProps {
  request: Request;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onContact: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({
  request,
  isOpen,
  onClose,
  onAccept,
  onContact
}) => {
  const { userType } = useAuth();
  const [showChatMessage, setShowChatMessage] = React.useState(false);

  if (!isOpen) return null;

  const handleContactClick = () => {
    setShowChatMessage(true);
    setTimeout(() => setShowChatMessage(false), 3000);
  };
  const formatDateTime = (date: Date, time: string) => {
    const today = new Date();
    const requestDate = new Date(date);
    
    if (requestDate.toDateString() === today.toDateString()) {
      return `היום, ${time}`;
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (requestDate.toDateString() === tomorrow.toDateString()) {
      return `מחר, ${time}`;
    }
    
    return `${requestDate.toLocaleDateString('he-IL')}, ${time}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 z-50 overflow-y-auto">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white shadow-sm">
          <h2 className="text-xl font-bold">פרטי בקשה</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Header - Service Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100 shadow-soft">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {typeof request.serviceType === 'string' && SERVICE_TYPES[request.serviceType as keyof typeof SERVICE_TYPES] 
                    ? SERVICE_TYPES[request.serviceType as keyof typeof SERVICE_TYPES]
                    : request.serviceType}
                </h1>
                <div className="flex items-center gap-4 mb-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                    request.status === 'open' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                    request.status === 'accepted' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' :
                    request.status === 'completed' ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                    'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  }`}>
                    {request.status === 'open' ? 'בקשה פתוחה' :
                     request.status === 'completed' ? 'בקשה הושלמה' :
                     'בקשה לא ידועה'}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-gray-700">
                  <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-full backdrop-blur-sm">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">{formatDateTime(request.date, request.time)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-full backdrop-blur-sm">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">{request.neighborhood}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl px-6 py-4 shadow-lg text-center min-w-[120px]">
                <DollarSign className="w-6 h-6 mx-auto mb-1" />
                <span className="text-2xl font-bold block">₪{request.offeredPrice}</span>
              </div>
            </div>
            
            {/* Publication Date */}
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-white/40 px-3 py-2 rounded-full w-fit backdrop-blur-sm">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">פורסם: {new Date(request.createdAt).toLocaleDateString('he-IL')}</span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Dog Information */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">פרטי הכלב</h3>
                <div className="flex gap-4 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-100">
                  <img
                    src={request.dog.image}
                    alt={request.dog.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-3 ring-white shadow-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{request.dog.name}</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="font-semibold text-orange-600">גזע:</span> {request.dog.breed}</p>
                      <p><span className="font-semibold text-orange-600">גיל:</span> {request.dog.age} שנים</p>
                    </div>
                    {request.dog.additionalInfo && (
                      <div className="mt-3 p-3 bg-white/80 rounded-lg border border-orange-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-orange-600">מידע נוסף:</span> {request.dog.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">פרטי הלקוח</h3>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900">{request.client.name}</h4>
                    <p className="text-sm text-gray-600 font-medium">{request.client.neighborhood}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Special Instructions */}
              {request.specialInstructions && (
                <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">הוראות מיוחדות</h3>
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                    <p className="text-gray-700 leading-relaxed">{request.specialInstructions}</p>
                  </div>
                </div>
              )}

              {/* Cancellation Policy */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">מדיניות ביטול</h3>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p><span className="font-semibold">עד 24 שעות לפני השירות</span> - ללא עמלה</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p><span className="font-semibold">עד 2 שעות לפני השירות</span> - עמלת ביטול של 50%</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p><span className="font-semibold">פחות מ-2 שעות לפני השירות</span> - חיוב מלא</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button - Full Width */}
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-6">
              <button
                onClick={handleContactClick}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl hover:from-orange-600 hover:to-pink-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                <MessageCircle className="w-6 h-6" />
                שלח הודעה לבעל הכלב
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Message Toast */}
      {showChatMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60]">
          <div className="gradient-card rounded-2xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl max-w-sm mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
              בקרוב!
            </h3>
            <p className="text-gray-700 font-medium">
              כאן יוכנס צ'אט פנימי
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;