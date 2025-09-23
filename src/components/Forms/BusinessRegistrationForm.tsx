import React, { useState } from 'react';
import { X, Building, Upload, MapPin, Phone, Mail, Clock, FileText, CreditCard, Check } from 'lucide-react';
import { BUSINESS_CATEGORIES, NEIGHBORHOODS, SUBSCRIPTION_PLANS, ADDITIONAL_SERVICES, PRODUCT_CATEGORIES, TRAINING_TYPES, GROOMING_SERVICES, VETERINARY_SERVICES } from '../../types';

interface BusinessRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (businessData: any) => void;
}

const BusinessRegistrationForm: React.FC<BusinessRegistrationFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic fields
    businessName: '',
    logo: null as File | null,
    additionalImages: [] as File[],
    category: '',
    phone: '',
    email: '',
    whatsappLink: '',
    websiteLink: '',
    city: '',
    street: '',
    houseNumber: '',
    shortDescription: '',
    specialOffer: '',
    openingHours: {} as Record<string, { isOpen: boolean; openTime: string; closeTime: string }>,
    services: [] as Array<{ name: string; price: string; description?: string; duration?: string }>,
    
    // Category specific fields
    // Pension
    maxDogs: '',
    specialConditions: '',
    additionalServices: [] as string[],
    
    // Pet Store
    hasDelivery: false,
    productCategories: [] as string[],
    deliveryAreas: [] as string[],
    
    // Trainer
    trainingTypes: [] as string[],
    professionalExperience: '',
    certificates: [] as string[],
    groupLessons: false,
    privateLessons: false,
    
    // Grooming
    groomingServices: [] as string[],
    dogSizeSupport: [] as string[],
    appointmentRequired: false,
    homeService: false,
    
    // Veterinary
    emergencyPhone: '',
    emergencyHours: '',
    specializations: [] as string[],
    onlineBooking: false,
    
    // Subscription
    subscriptionType: 'trial' as 'trial' | 'monthly' | 'yearly',
    agreeToTerms: false
  });

  if (!isOpen) return null;

  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    setStep(1);
  };

  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files) return;
    
    if (field === 'logo') {
      setFormData(prev => ({ ...prev, logo: files[0] }));
    } else if (field === 'additionalImages') {
      setFormData(prev => ({ ...prev, additionalImages: Array.from(files) }));
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-xl flex items-center gap-3 text-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
          <Building className="w-4 h-4 text-white" />
        </div>
        פרטים בסיסיים
      </h3>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">שם העסק *</label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
          placeholder="שם העסק שלך"
          required
          minLength={2}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          קישור וואטסאפ 
          <span className="text-blue-600 font-bold"> (מומלץ מאוד!)</span>
        </label>
        <input
          type="url"
          value={formData.whatsappLink}
          onChange={(e) => setFormData(prev => ({ ...prev, whatsappLink: e.target.value }))}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
          placeholder="https://wa.me/972501234567"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">קישור לאתר (אופציונלי)</label>
        <input
          type="url"
          value={formData.websiteLink}
          onChange={(e) => setFormData(prev => ({ ...prev, websiteLink: e.target.value }))}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
          placeholder="https://website.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">לוגו / תמונה ראשית *</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleFileChange('logo', e.target.files)}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
          required
        />
        <p className="text-xs text-orange-600 mt-2">JPG או PNG, עד 5MB</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">תמונות נוספות (אופציונלי)</label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={(e) => handleFileChange('additionalImages', e.target.files)}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
        />
        <p className="text-xs text-orange-600 mt-2">עד 5 תמונות נוספות</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">קטגוריה *</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
          required
        >
          <option value="">בחר קטגוריה</option>
          {Object.entries(BUSINESS_CATEGORIES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-xl flex items-center gap-3 text-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        פרטי קשר ומיקום
      </h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">טלפון *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
            placeholder="050-1234567"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">אימייל *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
            placeholder="business@example.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">עיר *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
            placeholder="תל אביב"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">רחוב *</label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
            placeholder="רחוב הרצל"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">מספר *</label>
          <input
            type="text"
            value={formData.houseNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, houseNumber: e.target.value }))}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
            placeholder="45"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">תיאור קצר *</label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
          rows={3}
          maxLength={300}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm resize-none"
          placeholder="תיאור קצר של העסק (עד 300 תווים)"
          required
        />
        <p className="text-xs text-orange-600 mt-2">{formData.shortDescription.length}/300 תווים</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          הצעה מיוחדת לחברי דוגיסיטר 
          <span className="text-blue-600 font-bold"> (מומלץ מאוד!)</span>
        </label>
        <input
          type="text"
          value={formData.specialOffer}
          onChange={(e) => setFormData(prev => ({ ...prev, specialOffer: e.target.value }))}
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
          placeholder="לדוגמה: 10% הנחה לחברי דוגיסיטר"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-xl flex items-center gap-3 text-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
          <Clock className="w-4 h-4 text-white" />
        </div>
        שעות פעילות
      </h3>
      
      <div className="space-y-4">
        {days.map((day) => (
          <div key={day} className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl">
            <div className="w-20">
              <span className="font-medium">{day}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.openingHours[day]?.isOpen || false}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  openingHours: {
                    ...prev.openingHours,
                    [day]: { ...prev.openingHours[day], isOpen: e.target.checked }
                  }
                }))}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
              />
              <span className="text-sm">פתוח</span>
            </div>
            {formData.openingHours[day]?.isOpen && (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={formData.openingHours[day]?.openTime || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    openingHours: {
                      ...prev.openingHours,
                      [day]: { ...prev.openingHours[day], openTime: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 bg-white border-2 border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                />
                <span>-</span>
                <input
                  type="time"
                  value={formData.openingHours[day]?.closeTime || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    openingHours: {
                      ...prev.openingHours,
                      [day]: { ...prev.openingHours[day], closeTime: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 bg-white border-2 border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => {
    const renderServicesSection = () => (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-lg text-orange-900">שירותים ומחירים *</h4>
          <button
            type="button"
            onClick={() => setFormData(prev => ({
              ...prev,
              services: [...prev.services, { name: '', price: '', description: '', duration: '' }]
            }))}
            className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm hover:from-orange-600 hover:to-pink-600 transition-colors shadow-lg"
          >
            + הוסף שירות
          </button>
        </div>
        
        {formData.services.map((service, index) => (
          <div key={index} className="p-4 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">שירות {index + 1}</h5>
              {formData.services.length > 1 && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    services: prev.services.filter((_, i) => i !== index)
                  }))}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  מחק
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="שם השירות *"
                value={service.name}
                onChange={(e) => {
                  const newServices = [...formData.services];
                  newServices[index].name = e.target.value;
                  setFormData(prev => ({ ...prev, services: newServices }));
                }}
                className="px-3 py-2 bg-white border-2 border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                required
              />
              <input
                type="number"
                placeholder="מחיר (₪) *"
                value={service.price}
                onChange={(e) => {
                  const newServices = [...formData.services];
                  newServices[index].price = e.target.value;
                  setFormData(prev => ({ ...prev, services: newServices }));
                }}
                className="px-3 py-2 bg-white border-2 border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                required
              />
            </div>
            
            <input
              type="text"
              placeholder="תיאור השירות (אופציונלי)"
              value={service.description || ''}
              onChange={(e) => {
                const newServices = [...formData.services];
                newServices[index].description = e.target.value;
                setFormData(prev => ({ ...prev, services: newServices }));
              }}
              className="w-full px-3 py-2 bg-white border-2 border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
            
            <input
              type="text"
              placeholder="משך זמן (אופציונלי)"
              value={service.duration || ''}
              onChange={(e) => {
                const newServices = [...formData.services];
                newServices[index].duration = e.target.value;
                setFormData(prev => ({ ...prev, services: newServices }));
              }}
              className="w-full px-3 py-2 bg-white border-2 border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
          </div>
        ))}
      </div>
    );

    const renderCategorySpecificFields = () => {
      switch (formData.category) {
        case 'pension':
          return (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg text-orange-900">שדות ייחודיים לפנסיון</h4>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">מספר מקסימלי של כלבים *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxDogs}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxDogs: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">תנאים מיוחדים</label>
                <textarea
                  value={formData.specialConditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialConditions: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm resize-none"
                  placeholder="לדוגמה: רק כלבים מחוסנים"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">שירותים נוספים</label>
                <div className="grid grid-cols-2 gap-3">
                  {ADDITIONAL_SERVICES.map((service) => (
                    <label key={service} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.additionalServices.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              additionalServices: [...prev.additionalServices, service]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              additionalServices: prev.additionalServices.filter(s => s !== service)
                            }));
                          }
                        }}
                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                      <span className="text-sm font-medium">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {renderServicesSection()}
            </div>
          );

        case 'pet_store':
          return (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg text-orange-900">שדות ייחודיים לחנות ציוד</h4>
              
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                <input
                  type="checkbox"
                  id="hasDelivery"
                  checked={formData.hasDelivery}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasDelivery: e.target.checked }))}
                  className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
                />
                <label htmlFor="hasDelivery" className="text-gray-700 font-medium">
                  יש אפשרות משלוחים
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">קטגוריות מוצרים</label>
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCT_CATEGORIES.map((category) => (
                    <label key={category} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.productCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              productCategories: [...prev.productCategories, category]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              productCategories: prev.productCategories.filter(c => c !== category)
                            }));
                          }
                        }}
                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                      <span className="text-sm font-medium">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">אזורי משלוח (אם יש משלוחים)</label>
                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-4 bg-white/50 rounded-xl border border-orange-200">
                  {NEIGHBORHOODS.map((area) => (
                    <label key={area} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.deliveryAreas.includes(area)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              deliveryAreas: [...prev.deliveryAreas, area]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              deliveryAreas: prev.deliveryAreas.filter(a => a !== area)
                            }));
                          }
                        }}
                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                      <span className="text-sm font-medium">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {renderServicesSection()}
            </div>
          );

        case 'trainer':
          return (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg text-orange-900">שדות ייחודיים למאלף</h4>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">סוגי אילוף</label>
                <div className="grid grid-cols-2 gap-3">
                  {TRAINING_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.trainingTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              trainingTypes: [...prev.trainingTypes, type]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              trainingTypes: prev.trainingTypes.filter(t => t !== type)
                            }));
                          }
                        }}
                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                      <span className="text-sm font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">ניסיון מקצועי *</label>
                <textarea
                  value={formData.professionalExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, professionalExperience: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm resize-none"
                  placeholder="מספר שנים + תיאור קצר"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">תעודות / הסמכות</label>
                <div className="space-y-2">
                  {formData.certificates.map((cert, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => {
                          const newCerts = [...formData.certificates];
                          newCerts[index] = e.target.value;
                          setFormData(prev => ({ ...prev, certificates: newCerts }));
                        }}
                        className="flex-1 px-3 py-2 bg-white border-2 border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        placeholder="שם התעודה"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          certificates: prev.certificates.filter((_, i) => i !== index)
                        }))}
                        className="px-3 py-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        מחק
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      certificates: [...prev.certificates, '']
                    }))}
                    className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm hover:from-orange-600 hover:to-pink-600 transition-colors shadow-lg"
                  >
                    + הוסף תעודה
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">סוגי שיעורים</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.groupLessons}
                      onChange={(e) => setFormData(prev => ({ ...prev, groupLessons: e.target.checked }))}
                      className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="text-sm font-medium">שיעורים קבוצתיים</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.privateLessons}
                      onChange={(e) => setFormData(prev => ({ ...prev, privateLessons: e.target.checked }))}
                      className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="text-sm font-medium">שיעורים פרטיים</span>
                  </label>
                </div>
              </div>
              
              {renderServicesSection()}
            </div>
          );

        case 'grooming':
          return (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg text-orange-900">שדות ייחודיים לספר</h4>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">סוגי שירות</label>
                <div className="grid grid-cols-2 gap-3">
                  {GROOMING_SERVICES.map((service) => (
                    <label key={service} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.groomingServices.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              groomingServices: [...prev.groomingServices, service]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              groomingServices: prev.groomingServices.filter(s => s !== service)
                            }));
                          }
                        }}
                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                      <span className="text-sm font-medium">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">התאמות לכלב לפי גודל</label>
                <div className="grid grid-cols-3 gap-3">
                  {['קטן', 'בינוני', 'גדול'].map((size) => (
                    <label key={size} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.dogSizeSupport.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              dogSizeSupport: [...prev.dogSizeSupport, size]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              dogSizeSupport: prev.dogSizeSupport.filter(s => s !== size)
                            }));
                          }
                        }}
                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                      <span className="text-sm font-medium">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">אפשרויות שירות</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.appointmentRequired}
                      onChange={(e) => setFormData(prev => ({ ...prev, appointmentRequired: e.target.checked }))}
                      className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="text-sm font-medium">נדרש תיאום מראש</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.homeService}
                      onChange={(e) => setFormData(prev => ({ ...prev, homeService: e.target.checked }))}
                      className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="text-sm font-medium">שירות עד הבית</span>
                  </label>
                </div>
              </div>
              
              {renderServicesSection()}
            </div>
          );

        case 'veterinary':
          return (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg text-orange-900">שדות ייחודיים לוטרינר</h4>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">התמחויות</label>
                <div className="space-y-2">
                  {formData.specializations.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => {
                          const newSpecs = [...formData.specializations];
                          newSpecs[index] = e.target.value;
                          setFormData(prev => ({ ...prev, specializations: newSpecs }));
                        }}
                        className="flex-1 px-3 py-2 bg-white border-2 border-orange-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        placeholder="התמחות"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          specializations: prev.specializations.filter((_, i) => i !== index)
                        }))}
                        className="px-3 py-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        מחק
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      specializations: [...prev.specializations, '']
                    }))}
                    className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm hover:from-orange-600 hover:to-pink-600 transition-colors shadow-lg"
                  >
                    + הוסף התמחות
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">טלפון חירום</label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
                  placeholder="050-9876543"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">שעות חירום</label>
                <input
                  type="text"
                  value={formData.emergencyHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyHours: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm resize-none"
                  placeholder="לדוגמה: 24/7 או 18:00-08:00"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                <input
                  type="checkbox"
                  id="onlineBooking"
                  checked={formData.onlineBooking}
                  onChange={(e) => setFormData(prev => ({ ...prev, onlineBooking: e.target.checked }))}
                  className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
                />
                <label htmlFor="onlineBooking" className="text-gray-700 font-medium">
                  אפשרות להזמנת תור אונליין
                </label>
              </div>
              
              {renderServicesSection()}
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="space-y-6">
        <h3 className="font-bold text-xl flex items-center gap-3 text-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <FileText className="w-4 h-4 text-white" />
          </div>
          שדות מותאמים אישית
        </h3>

        {/* Initialize services if empty */}
        {formData.services.length === 0 && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-orange-800 text-sm">
              יש להוסיף לפחות שירות אחד עם מחיר
            </p>
          </div>
        )}

        {formData.category && renderCategorySpecificFields()}
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-xl flex items-center gap-3 text-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        מנוי ופרסום
      </h3>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg text-gray-900">בחר מסלול מנוי</h4>
        
        {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
          <label key={key} className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
            formData.subscriptionType === key 
              ? 'border-orange-500 bg-orange-50' 
              : 'border-gray-200 hover:border-orange-300'
          }`}>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="subscription"
                value={key}
                checked={formData.subscriptionType === key}
                onChange={(e) => setFormData(prev => ({ ...prev, subscriptionType: e.target.value as any }))}
                className="text-orange-600 focus:ring-orange-500 w-5 h-5"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-gray-900">{plan.name}</h5>
                  <span className="font-bold text-orange-600">
                    {plan.price === 0 ? 'חינם' : `₪${plan.price}`}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
        <input
          type="checkbox"
          id="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
          className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
          required
        />
        <label htmlFor="agreeToTerms" className="text-gray-700 font-medium">
          אני מאשר תנאי שימוש ומדיניות פרטיות *
        </label>
      </div>

      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
          <Check className="w-5 h-5" />
          מה קורה אחרי הרשמה?
        </h4>
        <div className="text-sm text-green-800 space-y-2">
          <p>• העסק שלך יופיע בטאב "עסקים" באפליקציה</p>
          <p>• בעלי כלבים יוכלו לראות ולפנות אליך</p>
          <p>• תקבל גישה ללוח ניהול לעדכון פרטים</p>
          <p>• תוכל לעקוב אחר פניות ומנוי</p>
        </div>
      </div>
    </div>
  );

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.businessName.length >= 2 && formData.logo && formData.category;
      case 2:
        return formData.phone && formData.email && formData.city && formData.street && formData.houseNumber && formData.shortDescription && formData.whatsappLink;
      case 3:
        return Object.values(formData.openingHours).some(hours => hours?.isOpen);
      case 4:
        // Must have at least one service with name and price
        const hasValidServices = formData.services.length > 0 && 
          formData.services.every(service => service.name.trim() && service.price.trim());
        
        // Category specific validation
        let categoryValid = true;
        if (formData.category === 'pension') {
          categoryValid = !!formData.maxDogs;
        } else if (formData.category === 'trainer') {
          categoryValid = !!formData.professionalExperience;
        }
        
        return hasValidServices && categoryValid;
      case 5:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-pink-50">
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            הרשמת עסק חדש
          </h2>
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
        <div className="p-4 sm:p-6">
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
              className="flex-1 py-2.5 sm:py-3 border-2 border-orange-200 rounded-lg sm:rounded-xl hover:bg-white transition-all font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              הקודם
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
            >
              הבא
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
            >
              פרסם את העסק
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationForm;