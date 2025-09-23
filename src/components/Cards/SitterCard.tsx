import React from 'react';
import { Star, MapPin, Clock, Shield, User } from 'lucide-react';
import { Sitter, SERVICE_TYPES } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface SitterCardProps {
  sitter: Sitter;
  onClick: () => void;
}

const SitterCard: React.FC<SitterCardProps> = ({ sitter, onClick }) => {
  const { user } = useAuth();
  const minPrice = Math.min(...sitter.services.map(s => s.price));
  const maxPrice = Math.max(...sitter.services.map(s => s.price));

  // Check if this is user's own profile
  const isMyProfile = user?.id === sitter.id && user?.userType === 'sitter';

  return (
    <div
      onClick={onClick}
      className={`gradient-card rounded-xl shadow-soft border p-4 card-hover cursor-pointer mx-2 backdrop-blur-xl relative ${
        isMyProfile 
          ? 'border-orange-300 bg-gradient-to-br from-orange-50/90 to-pink-50/90 ring-2 ring-orange-200' 
          : 'border-white/20'
      }`}
    >
      {/* My Profile Badge - Top Right Corner */}
      {isMyProfile && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs rounded-full font-medium shadow-soft z-10">
          הפרופיל שלי
        </div>
      )}

      <div className="flex gap-3">
        {/* Profile Image */}
        <div className="relative">
          {sitter.profileImage ? (
            <img
              src={sitter.profileImage}
              alt={sitter.name}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/50 shadow-soft"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 ring-2 ring-white/50 shadow-soft flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          )}
          {sitter.verified && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-1 shadow-soft ring-1 ring-white">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{sitter.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{sitter.neighborhoods.slice(0, 2).join(', ')}</span>
                {sitter.neighborhoods.length > 2 && <span>+{sitter.neighborhoods.length - 2}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-full shadow-soft">
                <Star className="w-4 h-4 text-white fill-current star-glow" />
                <span className="font-bold text-sm text-white">{sitter.rating}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{sitter.reviewCount} ביקורות</p>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {sitter.services.map((service, index) => (
              <span
                key={service.id || index}
                className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 text-xs rounded-full border border-blue-200/50 backdrop-blur-sm"
              >
                {service.type}
              </span>
            ))}
          </div>

          {/* Experience & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{sitter.experience} ניסיון</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-green-600 text-lg">
                ₪{minPrice}-{maxPrice}
              </span>
              <p className="text-xs text-gray-600">לשירות</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitterCard;