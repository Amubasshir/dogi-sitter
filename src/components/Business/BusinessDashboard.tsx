import React, { useState } from 'react';
import { Building, Edit, Eye, MessageCircle, TrendingUp, Calendar, Settings, Bell, CreditCard, Users, Save, X, Upload, Camera, Phone, MapPin, Star, Shield, Sparkles, Mail, Globe, Navigation } from 'lucide-react';
import { BUSINESS_CATEGORIES, NEIGHBORHOODS } from '../../types';

interface BusinessDashboardProps {
  business: any;
  businessData?: any;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ business, businessData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'profile' | 'subscription'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(businessData || {});
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const mockInquiries = [
    {
      id: '1',
      clientName: 'דני כהן',
      message: 'מעוניין בפנסיון לסוף השבוע',
      date: new Date('2024-01-20'),
      status: 'new'
    },
    {
      id: '2',
      clientName: 'שרה לוי',
      message: 'כמה עולה אילוף בסיסי?',
      date: new Date('2024-01-19'),
      status: 'replied'
    }
  ];

  const mockStats = {
    views: businessData ? 0 : 156,
    inquiries: businessData ? 0 : 23,
    conversions: businessData ? 0 : 8,
    rating: businessData ? 0 : 4.8
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', editData);
    // In a real app, this would make an API call
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData(businessData || {});
    setIsEditing(false);
  };

  const handleFileChange = (field: string, file: File | null) => {
    setEditData(prev => ({ ...prev, [field]: file }));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="gradient-card p-4 rounded-xl shadow-soft border border-white/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{mockStats.views}</div>
              <div className="text-sm text-gray-600">צפיות</div>
            </div>
          </div>
        </div>

        <div className="gradient-card p-4 rounded-xl shadow-soft border border-white/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center shadow-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{mockStats.inquiries}</div>
              <div className="text-sm text-gray-600">פניות</div>
            </div>
          </div>
        </div>

        <div className="gradient-card p-4 rounded-xl shadow-soft border border-white/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-lg flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{mockStats.conversions}</div>
              <div className="text-sm text-gray-600">הזמנות</div>
            </div>
          </div>
        </div>

        <div className="gradient-card p-4 rounded-xl shadow-soft border border-white/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{mockStats.rating || 'חדש'}</div>
              <div className="text-sm text-gray-600">דירוג</div>
            </div>
          </div>
        </div>
      </div>

      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">פניות אחרונות</h3>
        {businessData ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>עדיין לא התקבלו פניות</p>
            <p className="text-sm">פניות מלקוחות יופיעו כאן</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mockInquiries.slice(0, 3).map((inquiry) => (
              <div key={inquiry.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                <div>
                  <div className="font-medium text-gray-900">{inquiry.clientName}</div>
                  <div className="text-sm text-gray-600">{inquiry.message}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {inquiry.date.toLocaleDateString('he-IL')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderInquiries = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">כל הפניות</h3>
        {!businessData && (
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full text-sm shadow-soft">
              חדשות ({mockInquiries.filter(i => i.status === 'new').length})
            </button>
            <button className="px-3 py-1 bg-white/50 text-gray-700 rounded-full text-sm backdrop-blur-sm">
              נענו ({mockInquiries.filter(i => i.status === 'replied').length})
            </button>
          </div>
        )}
      </div>

      {businessData ? (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-medium mb-2">עדיין לא התקבלו פניות</h4>
          <p>כשלקוחות יפנו אליך, הפניות יופיעו כאן</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockInquiries.map((inquiry) => (
            <div key={inquiry.id} className="gradient-card p-4 rounded-xl shadow-soft border border-white/20 backdrop-blur-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium text-gray-900">{inquiry.clientName}</div>
                  <div className="text-sm text-gray-500">
                    {inquiry.date.toLocaleDateString('he-IL')} {inquiry.date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  inquiry.status === 'new' 
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-soft' 
                    : 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-soft'
                }`}>
                  {inquiry.status === 'new' ? 'חדש' : 'נענה'}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{inquiry.message}</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                  השב
                </button>
                <button className="px-4 py-2 border border-orange-200 text-gray-700 rounded-lg text-sm hover:bg-orange-50 transition-colors backdrop-blur-sm">
                  סמן כנענה
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Business Profile - Same as BusinessDetails component */}
      <div className="min-h-screen gradient-bg">
        <div className="max-w-4xl mx-auto p-6">
          {/* Business Header */}
          <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">פרופיל העסק</h2>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Edit className="w-4 h-4" />
                  עריכה
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    שמור
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-4 py-2 border border-orange-200 text-gray-700 rounded-lg text-sm hover:bg-orange-50 transition-colors backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                    ביטול
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-6 mb-6">
              <div className="relative">
                <img
                  src={editData.logo ? URL.createObjectURL(editData.logo) : 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={editData.businessName || 'עסק'}
                  className="w-28 h-28 rounded-xl object-cover ring-4 ring-orange-100 shadow-lg"
                />
                {editData.verified !== false && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg ring-2 ring-white">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
                {isEditing && (
                  <div className="mt-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.businessName || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, businessName: e.target.value }))}
                        className="text-3xl font-bold text-gray-900 mb-2 border-b-2 border-orange-200 focus:border-orange-500 outline-none bg-transparent"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{editData.businessName || 'שם העסק'}</h1>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      {isEditing ? (
                        <select
                          value={editData.category || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                          className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-100"
                        >
                          <option value="">בחר קטגוריה</option>
                          {Object.entries(BUSINESS_CATEGORIES).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-400/20 to-pink-400/20 text-orange-700 rounded-full text-sm border border-orange-200/50 backdrop-blur-sm">
                          {editData.category ? BUSINESS_CATEGORIES[editData.category] : 'קטגוריה'}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full text-sm shadow-soft">
                        פתוח עכשיו
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full shadow-soft">
                    <Star className="w-5 h-5 text-white fill-current star-glow" />
                    <span className="font-bold text-white">חדש</span>
                    <span className="text-white">(0 ביקורות)</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="רחוב"
                        value={editData.street || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, street: e.target.value }))}
                        className="text-sm border-b border-gray-200 focus:border-orange-500 outline-none bg-transparent"
                      />
                      <input
                        type="text"
                        placeholder="מספר"
                        value={editData.houseNumber || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, houseNumber: e.target.value }))}
                        className="text-sm border-b border-gray-200 focus:border-orange-500 outline-none bg-transparent w-16"
                      />
                      <input
                        type="text"
                        placeholder="עיר"
                        value={editData.city || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, city: e.target.value }))}
                        className="text-sm border-b border-gray-200 focus:border-orange-500 outline-none bg-transparent"
                      />
                    </div>
                  ) : (
                    <span>
                      {editData.street && editData.houseNumber && editData.city 
                        ? `${editData.street} ${editData.houseNumber}, ${editData.city}`
                        : 'כתובת'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        className="text-sm border-b border-gray-200 focus:border-orange-500 outline-none bg-transparent"
                      />
                    ) : (
                      <span>{editData.phone || 'טלפון'}</span>
                    )}
                  </div>
                  {editData.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                          className="text-sm border-b border-gray-200 focus:border-orange-500 outline-none bg-transparent"
                        />
                      ) : (
                        <span>{editData.email}</span>
                      )}
                    </div>
                  )}
                  {editData.bookingLink && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {isEditing ? (
                        <input
                          type="url"
                          value={editData.bookingLink || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, bookingLink: e.target.value }))}
                          placeholder="https://wa.me/972501234567"
                          className="text-sm border-b border-gray-200 focus:border-orange-500 outline-none bg-transparent"
                        />
                      ) : (
                        <span>אתר אינטרנט</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">גלריה</h3>
              {isEditing && (
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={(e) => handleFileChange('additionalImages', e.target.files)}
                  className="text-sm"
                />
              )}
            </div>
            {editData.additionalImages && editData.additionalImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from(editData.additionalImages).map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`${editData.businessName} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {isEditing && (
                      <button
                        onClick={() => {
                          const newImages = Array.from(editData.additionalImages).filter((_, i) => i !== index);
                          setEditData(prev => ({ ...prev, additionalImages: newImages }));
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-orange-200 rounded-lg">
                <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>לא הועלו תמונות נוספות</p>
                {isEditing && <p className="text-sm">השתמש בכפתור למעלה להעלאת תמונות</p>}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">אודות</h3>
            {isEditing ? (
              <textarea
                value={editData.shortDescription || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, shortDescription: e.target.value }))}
                rows={4}
                maxLength={300}
                className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none backdrop-blur-sm"
                placeholder="תיאור קצר של העסק"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{editData.shortDescription || 'תיאור קצר של העסק'}</p>
            )}
          </div>

          {/* Special Offer */}
          {(editData.specialOffer || isEditing) && (
            <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">הצעה מיוחדת</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.specialOffer || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, specialOffer: e.target.value }))}
                  placeholder="10% הנחה לחברי דוגיסיטר"
                  className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm"
                />
              ) : (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">{editData.specialOffer}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Services & Prices - Category Specific */}
          {editData.category && (
            <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">שירותים ומחירים</h3>
              
              {editData.category === 'pension' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <span className="font-medium">לינה יומית</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={editData.pricePerNight || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, pricePerNight: e.target.value }))}
                        className="w-20 px-2 py-1 border border-orange-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="₪"
                      />
                    ) : (
                      <span className="font-semibold text-green-600">₪{editData.pricePerNight || '120'}</span>
                    )}
                  </div>
                  {editData.maxDogs && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm text-orange-800">מקסימום {editData.maxDogs} כלבים</span>
                    </div>
                  )}
                </div>
              )}

              {editData.category === 'trainer' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <span className="font-medium">שיעור אילוף</span>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={editData.lessonPrice || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, lessonPrice: e.target.value }))}
                        className="w-20 px-2 py-1 border border-orange-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="₪"
                      />
                    ) : (
                      <span className="font-semibold text-green-600">₪{editData.lessonPrice || '300'}</span>
                    )}
                  </div>
                </div>
              )}

              {editData.category === 'grooming' && editData.estimatedPrices && (
                <div className="p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                  {isEditing ? (
                    <textarea
                      value={editData.estimatedPrices || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, estimatedPrices: e.target.value }))}
                      rows={3}
                      className="w-full p-2 border border-orange-300 rounded text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="לדוגמה: תספורת כלב קטן – 120 ₪"
                    />
                  ) : (
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{editData.estimatedPrices}</pre>
                  )}
                </div>
              )}

              {editData.category === 'veterinary' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <span className="font-medium">בדיקה כללית</span>
                    <span className="font-semibold text-green-600">₪180</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <span className="font-medium">חיסונים</span>
                    <span className="font-semibold text-green-600">₪150</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Opening Hours */}
          <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">שעות פעילות</h3>
            <div className="grid grid-cols-1 gap-2">
              {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
                <div key={day} className="flex items-center justify-between p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <span className="font-medium">{day}</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editData.openingHours?.[day]?.isOpen || false}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          openingHours: {
                            ...prev.openingHours,
                            [day]: { ...prev.openingHours?.[day], isOpen: e.target.checked }
                          }
                        }))}
                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                      />
                      {editData.openingHours?.[day]?.isOpen && (
                        <>
                          <input
                            type="time"
                            value={editData.openingHours[day]?.openTime || ''}
                            onChange={(e) => setEditData(prev => ({
                              ...prev,
                              openingHours: {
                                ...prev.openingHours,
                                [day]: { ...prev.openingHours[day], openTime: e.target.value }
                              }
                            }))}
                            className="px-2 py-1 border border-orange-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                          <span>-</span>
                          <input
                            type="time"
                            value={editData.openingHours[day]?.closeTime || ''}
                            onChange={(e) => setEditData(prev => ({
                              ...prev,
                              openingHours: {
                                ...prev.openingHours,
                                [day]: { ...prev.openingHours[day], closeTime: e.target.value }
                              }
                            }))}
                            className="px-2 py-1 border border-orange-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="text-green-700">
                      {editData.openingHours?.[day]?.isOpen 
                        ? `${editData.openingHours[day]?.openTime || '08:00'} - ${editData.openingHours[day]?.closeTime || '18:00'}`
                        : 'סגור'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex gap-3">
              <button
                onClick={() => editData.phone && window.open(`tel:${editData.phone}`)}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-5 h-5" />
                התקשר
              </button>
              {editData.bookingLink && (
                <button
                  onClick={() => window.open(editData.bookingLink, '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  וואטסאפ
                </button>
              )}
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(`${editData.street} ${editData.houseNumber}, ${editData.city}`)}`, '_blank')}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Navigation className="w-5 h-5" />
                נווט
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-6">
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">מצב מנוי</h3>
        
        <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="font-semibold text-green-900">מנוי פעיל</div>
            <div className="text-sm text-green-700">מנוי חודשי - מתחדש ב-15/02/2024</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-orange-200 rounded-xl bg-white/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">₪99</div>
              <div className="text-sm text-gray-600">מנוי חודשי</div>
              <div className="text-xs text-gray-500 mt-1">נוכחי</div>
            </div>
          </div>
          
          <div className="p-4 border border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-900">₪990</div>
              <div className="text-sm text-orange-700">מנוי שנתי</div>
              <div className="text-xs text-orange-600 mt-1">חיסכון 20%</div>
            </div>
          </div>
          
          <div className="p-4 border border-orange-200 rounded-xl bg-white/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">₪0</div>
              <div className="text-sm text-gray-600">ניסיון חינמי</div>
              <div className="text-xs text-gray-500 mt-1">7 ימים</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
            שדרג למנוי שנתי
          </button>
          <button className="flex-1 py-2 border border-orange-300 text-gray-700 rounded-lg hover:bg-orange-50 transition-colors backdrop-blur-sm">
            ניהול תשלומים
          </button>
        </div>
      </div>

      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">היסטוריית תשלומים</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg backdrop-blur-sm">
            <div>
              <div className="font-medium">מנוי חודשי - ינואר 2024</div>
              <div className="text-sm text-gray-600">15/01/2024</div>
            </div>
            <div className="text-green-600 font-semibold">₪99</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg backdrop-blur-sm">
            <div>
              <div className="font-medium">מנוי חודשי - דצמבר 2023</div>
              <div className="text-sm text-gray-600">15/12/2023</div>
            </div>
            <div className="text-green-600 font-semibold">₪99</div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'סקירה כללית', icon: TrendingUp },
    { id: 'inquiries', label: 'פניות', icon: MessageCircle },
    { id: 'profile', label: 'פרופיל עסק', icon: Edit },
    { id: 'subscription', label: 'מנוי', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-orange-100 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg float-animation">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">לוח ניהול עסק</h1>
              <p className="text-sm text-gray-600">{businessData?.businessName || business?.name || 'שם העסק'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-orange-50 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-orange-600" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full pulse-glow"></div>
              </button>
              {showNotifications && (
                <div className="absolute top-12 right-0 w-64 gradient-card rounded-lg shadow-xl border border-white/20 backdrop-blur-xl p-4 z-50">
                  <h4 className="font-semibold mb-2">התראות</h4>
                  <p className="text-sm text-gray-500">אין התראות חדשות</p>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-orange-600" />
              </button>
              {showSettings && (
                <div className="absolute top-12 right-0 w-48 gradient-card rounded-lg shadow-xl border border-white/20 backdrop-blur-xl p-2 z-50">
                  <button className="w-full text-right px-3 py-2 hover:bg-orange-50 rounded text-sm">
                    הגדרות כלליות
                  </button>
                  <button className="w-full text-right px-3 py-2 hover:bg-orange-50 rounded text-sm">
                    הגדרות התראות
                  </button>
                  <button className="w-full text-right px-3 py-2 hover:bg-orange-50 rounded text-sm">
                    עזרה ותמיכה
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/95 backdrop-blur-xl border-r border-orange-100 min-h-screen p-4 shadow-sm">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-all shadow-soft hover:shadow-md transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-orange-50 border border-orange-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'inquiries' && renderInquiries()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'subscription' && renderSubscription()}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;