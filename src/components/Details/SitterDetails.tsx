import React from 'react';
import { X, Star, MapPin, Clock, Shield, Phone, MessageCircle, Calendar, Camera, Video, Play, ChevronLeft, ChevronRight, Upload, Image as ImageIcon, Edit, Save, Plus, Trash2, User } from 'lucide-react';
import { Sitter, SERVICE_TYPES, NEIGHBORHOODS } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface SitterDetailsProps {
  sitter: Sitter;
  isOpen: boolean;
  onClose: () => void;
  onContact: () => void;
  onBooking: () => void;
}

const SitterDetails: React.FC<SitterDetailsProps> = ({
  sitter,
  isOpen,
  onClose,
  onContact,
  onBooking
}) => {
  const { user } = useAuth();
  const [showChatMessage, setShowChatMessage] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isEditing, setIsEditing] = React.useState(false);
  const [newImages, setNewImages] = React.useState<File[]>([]);
  const [newVideo, setNewVideo] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState<string | undefined>(sitter.profileImage);
  const [newProfileImage, setNewProfileImage] = React.useState<File | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  
  // Editable form data
  const [editData, setEditData] = React.useState({
    description: sitter.description,
    experience: sitter.experience,
    neighborhoods: [...sitter.neighborhoods],
    services: [...sitter.services],
    availability: sitter.availability ? [...sitter.availability] : []
  });
  
  // Gallery starts empty for new sitters
  const [gallery, setGallery] = React.useState<string[]>([]);
  
  // Video starts empty for new sitters
  const [introVideo, setIntroVideo] = React.useState<string | null>(null);
  
  const isOwnProfile = user?.id === sitter.id && user?.userType === 'sitter';

  if (!isOpen) return null;

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).slice(0, 6 - gallery.length); // Limit to 6 total images
      setNewImages(prev => [...prev, ...newFiles]);
    }
  };

  const handleVideoUpload = (file: File | null) => {
    if (file && file.type.startsWith('video/')) {
      setNewVideo(file);
    }
  };

  const handleProfileImageUpload = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setNewProfileImage(file);
    }
  };

  const removeImage = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= gallery.length - 1) {
      setCurrentImageIndex(Math.max(0, gallery.length - 2));
    }
  };

  const addService = () => {
    setEditData(prev => ({
      ...prev,
      services: [...prev.services, { id: Date.now().toString(), type: '', price: 0 }]
    }));
  };

  const removeService = (index: number) => {
    setEditData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const updateService = (index: number, field: 'type' | 'price' | 'description', value: string | number) => {
    setEditData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const toggleNeighborhood = (neighborhood: string) => {
    setEditData(prev => ({
      ...prev,
      neighborhoods: prev.neighborhoods.includes(neighborhood)
        ? prev.neighborhoods.filter(n => n !== neighborhood)
        : [...prev.neighborhoods, neighborhood]
    }));
  };

  const toggleAllNeighborhoods = () => {
    const allSelected = NEIGHBORHOODS.every(n => editData.neighborhoods.includes(n));
    setEditData(prev => ({
      ...prev,
      neighborhoods: allSelected ? [] : [...NEIGHBORHOODS]
    }));
  };
  const updateAvailability = (index: number, field: 'day' | 'startTime' | 'endTime', value: string) => {
    setEditData(prev => ({
      ...prev,
      availability: prev.availability.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const addAvailabilitySlot = () => {
    setEditData(prev => ({
      ...prev,
      availability: [...prev.availability, { day: 'ראשון', startTime: '08:00', endTime: '18:00' }]
    }));
  };

  const removeAvailabilitySlot = (index: number) => {
    setEditData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const saveAllChanges = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would upload to server and update sitter data
      if (newImages.length > 0) {
        const imageUrls = newImages.map(file => URL.createObjectURL(file));
        setGallery(prev => [...prev, ...imageUrls]);
        setNewImages([]);
      }
      
      if (newVideo) {
        setIntroVideo(URL.createObjectURL(newVideo));
        setNewVideo(null);
      }
      
      if (newProfileImage) {
        setProfileImage(URL.createObjectURL(newProfileImage));
        setNewProfileImage(null);
      }
      
      // Update sitter data (in real app this would be API call)
      console.log('Saving sitter data:', editData);
      
      // Update the sitter neighborhoods in the actual sitter object
      sitter.neighborhoods = [...editData.neighborhoods];
      
      setIsEditing(false);
      
      // Show styled success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setNewImages([]);
    setNewVideo(null);
    setNewProfileImage(null);
    // Reset form data
    setEditData({
      description: sitter.description,
      experience: sitter.experience,
      neighborhoods: [...sitter.neighborhoods],
      services: [...sitter.services],
      availability: sitter.availability ? [...sitter.availability] : []
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleContactClick = () => {
    setShowChatMessage(true);
    setTimeout(() => setShowChatMessage(false), 3000);
  };

  const mockReviews = [
    {
      id: '1',
      rating: 5,
      comment: 'מיכל הייתה מדהימה עם מקס! הכלב חזר עייף ומרוצה.',
      clientName: 'דני כהן',
      date: new Date('2024-01-15')
    },
    {
      id: '2',
      rating: 5,
      comment: 'מקצועית ואמינה. בהחלט נשתמש שוב בשירותיה.',
      clientName: 'שרה לוי',
      date: new Date('2024-01-10')
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 z-50 overflow-y-auto">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white shadow-sm">
          <h2 className="text-xl font-bold">פרטי סיטר</h2>
          <div className="flex items-center gap-3">
            {/* Edit/Save Button for Own Profile */}
            {isOwnProfile && (
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Edit className="w-4 h-4" />
                    עריכת פרופיל
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={saveAllChanges}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          שומר...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          שמור הכל
                        </>
                      )}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={isLoading}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      ביטול
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Profile Header - Full Width */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex gap-6 mb-6">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={sitter.name}
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-100 shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 ring-4 ring-blue-100 shadow-lg flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                
                {/* Profile Image Upload (Edit Mode) */}
                {isEditing && (
                  <div className="absolute -top-2 -left-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleProfileImageUpload(e.target.files?.[0] || null)}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer z-20"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                  </div>
                )}
                
                {sitter.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg ring-2 ring-white">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{sitter.name}</h1>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-yellow-700">{sitter.rating}</span>
                    <span className="text-yellow-600">({sitter.reviewCount} ביקורות)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{isEditing ? (
                      <select
                        value={editData.experience}
                        onChange={(e) => setEditData(prev => ({ ...prev, experience: e.target.value }))}
                        className="ml-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1-2 שנים">1-2 שנים</option>
                        <option value="3-5 שנים">3-5 שנים</option>
                        <option value="5+ שנים">5+ שנים</option>
                        <option value="10+ שנים">10+ שנים</option>
                      </select>
                    ) : editData.experience} ניסיון</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{sitter.neighborhoods.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Video Introduction Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-600" />
                    סרטון הצגה עצמית
                  </h3>
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleVideoUpload(e.target.files?.[0] || null)}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg cursor-pointer hover:bg-purple-200 transition-colors text-sm"
                      >
                        <Video className="w-4 h-4" />
                        {introVideo ? 'החלף סרטון' : 'העלה סרטון'}
                      </label>
                    </div>
                  )}
                </div>
                
                {introVideo ? (
                  <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                    <div className="aspect-video relative">
                      <video
                        className="w-full h-full object-cover"
                        poster="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800"
                        controls
                        preload="metadata"
                      >
                        <source src={introVideo} type="video/mp4" />
                        הדפדפן שלך לא תומך בהצגת וידאו.
                      </video>
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-8 h-8 text-gray-800 mr-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">אין סרטון הצגה עצמית</p>
                    {isOwnProfile && (
                      <p className="text-gray-500 text-sm mt-1">הוסף סרטון כדי להציג את עצמך ללקוחות</p>
                    )}
                  </div>
                )}
                
                {newVideo && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <Video className="w-4 h-4" />
                      <span className="text-sm font-medium">סרטון חדש נבחר: {newVideo.name}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">אודות</h3>
                  {isEditing && (
                    <Edit className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                {isEditing ? (
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="ספר על עצמך, הניסיון שלך עם כלבים..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{editData.description}</p>
                )}
              </div>

              {/* Services & Prices */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">שירותים ומחירים</h3>
                  {isEditing && (
                    <button
                      onClick={addService}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      הוסף שירות
                    </button>
                  )}
                </div>
                <div className="grid gap-3">
                  {editData.services.map((service, index) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      {isEditing ? (
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              placeholder="שם השירות"
                              value={service.type}
                              onChange={(e) => updateService(index, 'type', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="number"
                              min="1"
                              placeholder="מחיר"
                              value={service.price}
                              onChange={(e) => updateService(index, 'price', parseInt(e.target.value))}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <span className="text-gray-600">₪</span>
                            <button
                              onClick={() => removeService(index)}
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="תיאור השירות (אופציונלי)"
                            value={service.description || ''}
                            onChange={(e) => updateService(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{service.type}</span>
                            <span className="font-semibold text-green-600">₪{service.price}</span>
                          </div>
                          {service.description && (
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Neighborhoods */}
              {isEditing && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">אזורי שירות</h3>
                  
                  {/* Select All Option */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={NEIGHBORHOODS.every(n => editData.neighborhoods.includes(n))}
                        onChange={toggleAllNeighborhoods}
                        className="rounded border-blue-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
                      />
                      <span className="text-sm font-bold text-blue-800">כל השכונות בעיר</span>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {NEIGHBORHOODS.map((neighborhood) => (
                      <label key={neighborhood} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.neighborhoods.includes(neighborhood)}
                          onChange={() => toggleNeighborhood(neighborhood)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="text-sm font-medium text-gray-700">{neighborhood}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {!isOwnProfile && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <button
                    onClick={handleContactClick}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 font-semibold"
                  >
                    <MessageCircle className="w-5 h-5" />
                    צור קשר
                  </button>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Gallery Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-600" />
                    גלריית תמונות ({gallery.length})
                  </h3>
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors text-sm"
                      >
                        <ImageIcon className="w-4 h-4" />
                        הוסף תמונות
                      </label>
                      <span className="text-xs text-gray-500">({gallery.length + newImages.length}/6)</span>
                    </div>
                  )}
                </div>
                
                {/* New Profile Image Preview */}
                {newProfileImage && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-blue-300">
                        <img
                          src={URL.createObjectURL(newProfileImage)}
                          alt="תמונת פרופיל חדשה"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-blue-800">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm font-medium">תמונת פרופיל חדשה נבחרה</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {gallery.length > 0 ? (
                  <div>
                    {/* Main Image Display */}
                    <div className="relative mb-4">
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={gallery[currentImageIndex]}
                          alt={`תמונה ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Delete Image Button (Edit Mode) */}
                      {isEditing && (
                        <button
                          onClick={() => removeImage(currentImageIndex)}
                          className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Navigation Arrows */}
                      {gallery.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {gallery.length}
                      </div>
                    </div>
                    
                    {/* Thumbnail Strip */}
                    {gallery.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {gallery.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                              index === currentImageIndex
                                ? 'border-blue-500 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`תמונה ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">אין תמונות בגלריה</p>
                    {isOwnProfile && (
                      <p className="text-gray-500 text-sm mt-1">הוסף תמונות כדי להציג את השירותים שלך</p>
                    )}
                  </div>
                )}
                
                {/* New Images Preview */}
                {newImages.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">תמונות חדשות לשמירה:</h4>
                    <div className="flex gap-2 overflow-x-auto">
                      {newImages.map((file, index) => (
                        <div key={index} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-blue-300">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`תמונה חדשה ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">זמינות</h3>
                  {isEditing && (
                    <button
                      onClick={addAvailabilitySlot}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      הוסף יום
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {editData.availability && editData.availability.length > 0 ? (
                    editData.availability.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <select
                              value={slot.day}
                              onChange={(e) => updateAvailability(index, 'day', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map(day => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <span>-</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={() => removeAvailabilitySlot(index)}
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-medium">{slot.day}</span>
                            <span className="text-green-700">{slot.startTime} - {slot.endTime}</span>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>לא הוגדרה זמינות</p>
                      {isEditing && (
                        <p className="text-sm mt-1">הוסף ימים וזמנים זמינים</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">ביקורות</h3>
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">עדיין אין ביקורות</p>
                  <p className="text-sm mt-1">ביקורות מלקוחות יופיעו כאן</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60]">
          <div className="gradient-card rounded-2xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl max-w-sm mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Save className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
              נשמר בהצלחה!
            </h3>
            <p className="text-gray-700 font-medium">
              הפרטים שלך עודכנו במערכת
            </p>
          </div>
        </div>
      )}

      {/* Error Message Toast */}
      {showErrorMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60]">
          <div className="gradient-card rounded-2xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl max-w-sm mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <X className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              שגיאה בשמירה
            </h3>
            <p className="text-gray-700 font-medium">
              נסה שוב בעוד כמה רגעים
            </p>
          </div>
        </div>
      )}

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

export default SitterDetails;