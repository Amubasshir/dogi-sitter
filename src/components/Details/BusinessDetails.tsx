import React from 'react';
import { X, Star, MapPin, Clock, Shield, Phone, Mail, Globe, Calendar, Navigation } from 'lucide-react';
import { Business, BUSINESS_CATEGORIES } from '../../types';

interface BusinessDetailsProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onContact: () => void;
  onBooking: () => void;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({
  business,
  isOpen,
  onClose,
  onContact,
  onBooking
}) => {
  if (!isOpen) return null;

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

  const mockReviews = [
    {
      id: '1',
      rating: 5,
      comment: 'שירות מעולה ואמין. הכלב שלי נהנה מאוד!',
      clientName: 'רונית ש.',
      date: new Date('2024-01-15')
    },
    {
      id: '2',
      rating: 4,
      comment: 'מקצועיים ואדיבים. מחירים הוגנים.',
      clientName: 'יוסי כ.',
      date: new Date('2024-01-10')
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 z-50 overflow-y-auto">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white shadow-sm">
          <h2 className="text-xl font-bold">פרטי עסק</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Business Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex gap-6 mb-6">
              <div className="relative">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-28 h-28 rounded-xl object-cover ring-4 ring-blue-100 shadow-lg"
                />
                {business.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg ring-2 ring-white">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-100">
                        {BUSINESS_CATEGORIES[business.category]}
                      </span>
                      {isOpenNow() ? (
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-100">
                          פתוח עכשיו
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-100">
                          סגור
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-yellow-700">{business.rating}</span>
                    <span className="text-yellow-600">({business.reviewCount} ביקורות)</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{business.address}</span>
                </div>
                
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{business.phone}</span>
                  </div>
                  {business.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{business.email}</span>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>אתר אינטרנט</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          {business.gallery && business.gallery.length > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">גלריה</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {business.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${business.name} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">אודות</h3>
            <p className="text-gray-700 leading-relaxed">{business.description}</p>
          </div>

          {/* Services & Prices */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">שירותים ומחירים</h3>
            <div className="grid gap-3">
              {business.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    {service.description && (
                      <p className="text-sm text-gray-600">{service.description}</p>
                    )}
                    {service.duration && (
                      <p className="text-xs text-gray-500">משך: {service.duration}</p>
                    )}
                  </div>
                  <span className="font-semibold text-green-600 text-lg">₪{service.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">שעות פתיחה</h3>
            <div className="grid grid-cols-1 gap-2">
              {business.openingHours.map((hours, index) => (
                <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                  hours.isOpen ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <span className="font-medium">{hours.day}</span>
                  <span className={hours.isOpen ? 'text-green-700' : 'text-gray-500'}>
                    {hours.isOpen ? `${hours.openTime} - ${hours.closeTime}` : 'סגור'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">ביקורות</h3>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm">{review.clientName}</span>
                    <span className="text-xs text-gray-500">
                      {review.date.toLocaleDateString('he-IL')}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex gap-3">
              <button
                onClick={onContact}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-5 h-5" />
                התקשר
              </button>
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(business.address)}`, '_blank')}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Navigation className="w-5 h-5" />
                נווט
              </button>
              <button
                onClick={onBooking}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                הזמן שירות
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;