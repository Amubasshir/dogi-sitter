import React from 'react';
import { Star, MapPin, Clock, Shield, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { Business, BUSINESS_CATEGORIES } from '../../types';

interface BusinessCardProps {
  business: Business;
  onClick: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick }) => {
  const isOpenNow = () => {
    const now = new Date();
    const currentDay = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][now.getDay()];
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const todayHours = business.openingHours.find(h => h.day === currentDay);
    if (!todayHours || !todayHours.isOpen) return false;
    
    const openTime = parseInt(todayHours.openTime?.replace(':', '') || '0');
    const closeTime = parseInt(todayHours.closeTime?.replace(':', '') || '0');
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const minPrice = Math.min(...business.services.map(s => s.price));

  return (
    <div
      onClick={onClick}
      className="gradient-card rounded-xl shadow-soft border border-white/20 p-4 card-hover cursor-pointer mx-2 backdrop-blur-xl"
    >
      <div className="flex gap-3">
        {/* Business Image */}
        <div className="relative">
          <img
            src={business.image}
            alt={business.name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/50 shadow-soft"
          />
          {business.verified && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-1 shadow-soft ring-1 ring-white">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{business.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 rounded-full text-xs border border-blue-200/50 backdrop-blur-sm">
                  {BUSINESS_CATEGORIES[business.category]}
                </span>
                {isOpenNow() ? (
                  <span className="px-2 py-1 status-open text-white rounded-full text-xs shadow-soft">
                    פתוח עכשיו
                  </span>
                ) : (
                  <span className="px-2 py-1 status-closed text-white rounded-full text-xs shadow-soft">
                    סגור
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{business.neighborhood}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-full shadow-soft">
                <Star className="w-4 h-4 text-white fill-current star-glow" />
                <span className="font-bold text-sm text-white">{business.rating}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{business.reviewCount} ביקורות</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {business.description}
          </p>

          {/* Special Offer */}
          {business.specialOffer && (
            <div className="mb-3">
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 rounded-full text-xs border border-red-200/50 backdrop-blur-sm w-fit">
                <Sparkles className="w-3 h-3" />
                <span className="font-medium">{business.specialOffer}</span>
              </div>
            </div>
          )}
          {/* Price & Contact */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {business.whatsappLink && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(business.whatsappLink, '_blank');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs shadow-soft hover:from-green-600 hover:to-emerald-600 transition-all min-h-[32px]"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>וואטסאפ</span>
                </button>
              )}
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-green-600 text-lg">
                מ-₪{minPrice}
              </span>
              <p className="text-xs text-gray-600">החל מ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;