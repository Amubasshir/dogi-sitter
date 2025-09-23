import React from 'react';
import { Clock, MapPin, DollarSign, Dog, Calendar } from 'lucide-react';
import { Request, SERVICE_TYPES } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface RequestCardProps {
  request: Request;
  onClick: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onClick }) => {
  const { user } = useAuth();
  const formatTime = (date: Date, time: string) => {
    const today = new Date();
    const requestDate = new Date(date);
    
    if (requestDate.toDateString() === today.toDateString()) {
      return `היום ${time}`;
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (requestDate.toDateString() === tomorrow.toDateString()) {
      return `מחר ${time}`;
    }
    
    return `${requestDate.toLocaleDateString('he-IL')} ${time}`;
  };

  // Check if this is user's own request
  const isMyRequest = user?.id === request.clientId;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return {
          text: 'פתוח',
          bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
          textColor: 'text-white',
          shadow: 'shadow-green-200'
        };
      case 'completed':
        return {
          text: 'הושלם',
          bgColor: 'bg-gradient-to-r from-gray-400 to-gray-500',
          textColor: 'text-white',
          shadow: 'shadow-gray-200'
        };
      default:
        return {
          text: 'לא ידוע',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          shadow: 'shadow-gray-100'
        };
    }
  };

  const statusConfig = getStatusConfig(request.status);

  return (
    <div
      onClick={onClick}
      className={`gradient-card rounded-xl shadow-soft border p-4 card-hover cursor-pointer mx-2 backdrop-blur-xl relative ${
        isMyRequest 
          ? 'border-orange-300 bg-gradient-to-br from-orange-50/90 to-pink-50/90 ring-2 ring-orange-200' 
          : 'border-white/20'
      }`}
    >
      {/* My Request Badge - Top Left Corner */}
      {isMyRequest && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs rounded-full font-medium shadow-soft z-10">
          הבקשה שלי
        </div>
      )}

      {/* Header Row - Service Type and Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 ml-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">
            {typeof request.serviceType === 'string' && SERVICE_TYPES[request.serviceType as keyof typeof SERVICE_TYPES] 
              ? SERVICE_TYPES[request.serviceType as keyof typeof SERVICE_TYPES]
              : request.serviceType}
          </h3>
        </div>
        
        {/* Status Badge - Prominent */}
        <div className={`${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1.5 rounded-full text-sm font-bold shadow-lg ${statusConfig.shadow} pulse-glow`}>
          {statusConfig.text}
        </div>
      </div>

      {/* Main Content Row */}
      <div className="flex gap-3 mb-3">
        {/* Dog Image */}
        <div className="relative">
          <img
            src={request.dog.image}
            alt={request.dog.name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/50 shadow-soft flex-shrink-0"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Time and Location - High Priority */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-3 py-1.5 rounded-full border border-blue-200/50 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800 text-sm">{formatTime(request.date, request.time)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{request.neighborhood}</span>
          </div>

          {/* Dog Info */}
          <div className="flex items-center gap-1 mb-2">
            <Dog className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm">
              {request.dog.name} • {request.dog.breed}
            </span>
          </div>

          {/* Client Name */}
          <div className="text-sm font-medium text-gray-700">
            {request.client.name}
          </div>
        </div>

        {/* Price - Very Prominent */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl px-3 py-3 shadow-lg min-w-[80px]">
          <DollarSign className="w-5 h-5 mb-1" />
          <span className="font-bold text-lg leading-tight">₪{request.offeredPrice}</span>
        </div>
      </div>

      {/* Footer - Publication Date */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>פורסם: {new Date(request.createdAt).toLocaleDateString('he-IL')}</span>
        </div>
        
        {/* Status indicator dot */}
        <div className={`w-2.5 h-2.5 rounded-full ${statusConfig.bgColor} shadow-sm`}></div>
      </div>
    </div>
  );
};

export default RequestCard;