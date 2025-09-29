import React, { useState } from 'react';
import { X, User, Dog, Edit, Save, Camera, MapPin, Phone, Mail, Star, Shield, Clock, Plus, Trash2, FileText, MessageCircle, HelpCircle, LogOut, CreditCard, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NEIGHBORHOODS } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { addClientDog, registerSitterProfile } from '../../lib/api';
import toast from 'react-hot-toast';

const ProfileScreen: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'edit' | 'security' | 'reviews-requests' | 'payments' | 'help'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [editData, setEditData] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    // Client specific
    dogName: user?.dogName || '',
    dogBreed: user?.dogBreed || '',
    dogAge: user?.dogAge || 0,
    dogInfo: user?.dogInfo || '',
    dogImage: user?.dogImage || '',
    // Sitter specific
    description: user?.description || '',
    experience: user?.experience || '1-2 שנים',
    neighborhoods: user?.neighborhoods || [],
    allNeighborhoods: false,
    services: user?.services || [{ id: '1', name: '', price: 0, description: '' }],
    availability: user?.availability || [],
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }));

  console.log({activeTab})
  
  // Update editData when user data changes
  React.useEffect(() => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      // Client specific
      dogName: user?.dogName || '',
      dogBreed: user?.dogBreed || '',
      dogAge: user?.dogAge || 0,
      dogInfo: user?.dogInfo || '',
      dogImage: user?.dogImage || '',
      // Sitter specific
      description: user?.sitter?.description || '',
      experience: user?.sitter?.experience || '1-2 שנים',
      neighborhoods: user?.sitter?.neighborhoods || [],
      allNeighborhoods: false,
      services: user?.sitter?.services || [{ id: '1', name: '', price: 0, description: '' }],
      availability: user?.sitter?.availability || [],
      // Security
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [user]);
  
  // Bank accounts state
  const [bankAccounts, setBankAccounts] = useState(() => {
    // Load bank accounts from localStorage
    const savedBankAccounts = localStorage.getItem(`bankAccounts_${user?.id}`);
    if (savedBankAccounts) {
      try {
        return JSON.parse(savedBankAccounts);
      } catch (error) {
        console.error('Error parsing bank accounts:', error);
      }
    }
    
    // If user has bank details from registration, use them
    if (user?.accountHolderName && user?.accountNumber && user?.bankName) {
      const initialAccounts = [{
        id: '1',
        accountHolderName: user.accountHolderName,
        accountNumber: user.accountNumber,
        bankName: user.bankName,
        isActive: true,
        isEditing: false
      }];
      localStorage.setItem(`bankAccounts_${user?.id}`, JSON.stringify(initialAccounts));
      return initialAccounts;
    }

    console.log({editData, user})
    
    // Otherwise start with empty editable account
    const defaultAccounts = [{
      id: '1',
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      isActive: false,
      isEditing: true
    }];
    localStorage.setItem(`bankAccounts_${user?.id}`, JSON.stringify(defaultAccounts));
    return defaultAccounts;
  });
  const [editingBankId, setEditingBankId] = useState<string | null>(null);

   const handleFileChange = async (field: string, file: File | null) => {
      if (!file) return;
  
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`; // 👈 change folder name if needed
  
        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from("images") // 👈 replace with your bucket name
          .upload(filePath, file);
  
        if (error) throw error;
  
        // Get public URL
        const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  
        const url = data.publicUrl;

        console.log({url})
  
        // Update formData with the uploaded image URL
        setEditData((prev) => ({ ...prev, [field]: url }));
      } catch (err: any) {
        console.error("File upload error:", err.message);
      }
    };
  

  // Save bank accounts to localStorage whenever they change
  React.useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`bankAccounts_${user.id}`, JSON.stringify(bankAccounts));
    }
  }, [bankAccounts, user?.id]);

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">לא מחובר</h2>
          <p className="text-gray-600">יש להתחבר כדי לראות את הפרופיל</p>
        </div>
      </div>
    );
  }


  const handleChangePassword = async () => {
      try {
          // Validate that new passwords match
          if (editData.newPassword !== editData.confirmPassword) {
              toast.error("New passwords don't match");
              return;
            }


            // Optional: Verify current password first
        const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email, // Get from current session
        password: editData.currentPassword
        });

        if (signInError) {
        toast.error('Current password is incorrect');
        return;
    }
    
    // console.log({data})
    
    // Update password using Supabase
    const { data, error } = await supabase.auth.updateUser({
        password: editData.newPassword
    })

    console.log({data})
    
        if (error) {
        toast.error('Password changing failed!');
        return;
        }

        toast('Password updated successfully!');
        return { success: true };
        
  } catch (error) {
    toast.error('Error updating password:', error.message);
    return { success: false, error: error.message };
  }
  }


  const handleSave = async () => {

    // Update user data in context and localStorage
    const updatedData = {
      phone: editData.phone,
      // Client specific data
      dogName: editData.dogName,
      dogBreed: editData.dogBreed,
      dogAge: editData.dogAge,
      dogInfo: editData.dogInfo,
      // Sitter specific data
      description: editData.description,
      experience: editData.experience,
      neighborhoods: editData.allNeighborhoods ? ['כל השכונות בעיר'] : editData.neighborhoods,
      services: editData.services.filter(s => s.name.trim() && s.price > 0),
      availability: editData.availability
    };
    
    // Update user in context (this will also update localStorage)
    // updateUser(updatedData);

    if(user?.userType === 'client' && activeTab === 'profile') {
        addClientDog({
            name: editData.dogName,
            breed: editData.dogBreed,
            age: editData.dogAge,
            size: 'medium',
            image: editData.dogImage,
            additional_info: editData.dogInfo,
            client_id: user.id,
        })
    }
    
    // Update sitters list if user is a sitter
    if (user?.userType === 'sitter' && activeTab === 'profile') {
      const storedSitters = localStorage.getItem('registeredSitters');
      if (storedSitters) {
        try {
          const sitters = JSON.parse(storedSitters);
          const updatedSitters = sitters.map(sitter => 
            sitter.id === user.id ? {
              ...sitter,
              phone: editData.phone,
              description: editData.description,
              experience: editData.experience,
              neighborhoods: editData.allNeighborhoods ? ['כל השכונות בעיר'] : editData.neighborhoods,
              services: editData.services.filter(s => s.name.trim() && s.price > 0).map(service => ({
                id: service.id,
                type: service.name,
                price: service.price,
                description: service.description
              })),
              availability: editData.availability.map(slot => {
                const parts = slot.split(':');
                const day = parts[0] || 'ראשון';
                const startTime = parts.length >= 3 ? `${parts[1]}:${parts[2]}` : '09:00';
                const endTime = parts.length >= 5 ? `${parts[3]}:${parts[4]}` : '18:00';
                return { day, startTime, endTime };
              })
            } : sitter
          );

             await registerSitterProfile({
                                      id: user?.id,
                                      description: editData.description,
                                      experience: editData.experience,
                                      neighborhoods: editData.neighborhoods,
                                      availability: editData.availability,
                                      phone: editData.phone,
                                      all_neighborhoods: editData.allNeighborhoods,
                                      services: editData.services,
                                      });
          
          localStorage.setItem('registeredSitters', JSON.stringify(updatedSitters));
          
          // Trigger update event
          window.dispatchEvent(new CustomEvent('sittersUpdated'));
        } catch (error) {
          console.error('Error updating sitter in storage:', error);
        }
      }
    }
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    setIsEditing(false);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <div className="flex gap-6 mb-6">
          <div className="relative">
            {user.profileImage || user.dogImage ? (
              <img
                src={user.profileImage || user.dogImage}
                alt={user.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-orange-100 shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 ring-4 ring-orange-100 shadow-lg flex items-center justify-center">
                <User className="w-12 h-12 text-gray-500" />
              </div>
            )}
            
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full p-2 shadow-lg ring-2 ring-white">
              <Dog className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-gradient-to-r from-orange-400/20 to-pink-400/20 text-orange-700 rounded-full text-sm border border-orange-200/50 backdrop-blur-sm">
                בעל כלב
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dog Info */}
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Dog className="w-5 h-5 text-orange-600" />
          פרטי הכלב
        </h3>
        
        <div className="flex gap-4 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-100">
          {user.dogImage && (
            <img
              src={user.dogImage}
              alt={user.dogName}
              className="w-20 h-20 rounded-xl object-cover ring-3 ring-white shadow-lg"
            />
          )}
          <div className="flex-1">
            <h4 className="font-bold text-xl text-gray-900 mb-2">{user.dogName}</h4>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-semibold text-orange-600">גזע:</span> {user.dogBreed}</p>
              <p><span className="font-semibold text-orange-600">גיל:</span> {user.dogAge} שנים</p>
              {user.dogInfo && (
                <p><span className="font-semibold text-orange-600">מידע נוסף:</span> {user.dogInfo}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClientEditTab = () => (
    <div className="space-y-6">
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">עריכת פרטים אישיים</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
            <input
              type="tel"
              value={editData.phone || user?.phone || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">עריכת פרטי הכלב</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם הכלב</label>
            <input
              type="text"
              value={editData.dogName}
              onChange={(e) => setEditData(prev => ({ ...prev, dogName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גזע</label>
            <input
              type="text"
              value={editData.dogBreed}
              onChange={(e) => setEditData(prev => ({ ...prev, dogBreed: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל</label>
            <input
              type="number"
              min="0"
              max="25"
              value={editData.dogAge}
              onChange={(e) => setEditData(prev => ({ ...prev, dogAge: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מידע נוסף</label>
            <textarea
              value={editData.dogInfo}
              onChange={(e) => setEditData(prev => ({ ...prev, dogInfo: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תמונת הכלב</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) =>
              handleFileChange("dogImage", e.target.files?.[0] || null)
            }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-orange-600 mt-2">
              JPG או PNG, עד 5MB
            </p>
          </div>

        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all font-semibold shadow-lg"
          >
            שמור שינויים
          </button>
        </div>
      </div>
    </div>
  );

  const renderSitterEditTab = () => (
    <div className="space-y-6">
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">עריכת פרטים אישיים</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
            <input
              type="tel"
              value={editData.phone || user?.phone || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">תיאור ועיסוק</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">תיאור אישי</label>
            <textarea
              value={editData.description || user.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              placeholder="ספר על עצמך כדי שבעלי כלבים יכירו אותך"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {editData.description.length}/200 תווים
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ניסיון</label>
            <select
              value={editData.experience}
              onChange={(e) => setEditData(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="מתחיל">מתחיל</option>
              <option value="1-2 שנים">1-2 שנים</option>
              <option value="3-5 שנים">3-5 שנים</option>
              <option value="5+ שנים">5+ שנים</option>
              <option value="10+ שנים">10+ שנים</option>
            </select>
          </div>
        </div>
      </div>

      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">אזורי שירות</h3>
        
        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 bg-white/50 rounded-xl border-2 border-orange-200">
          <label className="flex items-center gap-3 cursor-pointer col-span-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
            <input
              type="checkbox"
              checked={editData.allNeighborhoods}
              onChange={(e) => {
                setEditData(prev => ({ ...prev, allNeighborhoods: e.target.checked }));
              }}
              className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
            />
            <span className="text-sm font-bold text-orange-800">כל השכונות בעיר</span>
          </label>
          {NEIGHBORHOODS.map((neighborhood) => (
            <label key={neighborhood} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                disabled={editData.allNeighborhoods}
                checked={editData.neighborhoods.includes(neighborhood)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setEditData(prev => ({
                      ...prev,
                      neighborhoods: [...prev.neighborhoods, neighborhood]
                    }));
                  } else {
                    setEditData(prev => ({
                      ...prev,
                      neighborhoods: prev.neighborhoods.filter(n => n !== neighborhood)
                    }));
                  }
                }}
                className={`rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4 ${editData.allNeighborhoods ? 'opacity-50' : ''}`}
              />
              <span className={`text-sm font-medium ${editData.allNeighborhoods ? 'text-gray-400' : 'text-gray-700'}`}>{neighborhood}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900">שירותים ומחירים</h3>
          <button
            type="button"
            onClick={() => setEditData(prev => ({
              ...prev,
              services: [...prev.services, { id: Date.now().toString(), name: '', price: 0, description: '' }]
            }))}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg"
          >
            + הוסף שירות
          </button>
        </div>
        
        <div className="space-y-3">
          {editData.services.map((service, index) => (
            <div key={service.id} className="p-4 bg-white/50 rounded-xl border-2 border-orange-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">שירות {index + 1}</h5>
                  {editData.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setEditData(prev => ({
                        ...prev,
                        services: prev.services.filter((_, i) => i !== index)
                       }))}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <input
                  type="text"
                  placeholder="שם השירות"
                  value={service.name || ''}
                  onChange={(e) => {
                    const newServices = [...editData.services];
                    newServices[index].name = e.target.value;
                    setEditData(prev => ({ ...prev, services: newServices }));
                  }}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="מחיר"
                    value={service.price}
                    onChange={(e) => {
                      const newServices = [...editData.services];
                      newServices[index].price = parseInt(e.target.value) || 0;
                      setEditData(prev => ({ ...prev, services: newServices }));
                    }}
                    className="w-24 px-3 py-2 border border-orange-300 rounded-lg text-center focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="text-sm text-gray-600">₪</span>
                </div>
                
                <input
                  type="text"
                  placeholder="תיאור השירות (אופציונלי)"
                  value={service.description || ''}
                  onChange={(e) => {
                    const newServices = [...editData.services];
                    newServices[index].description = e.target.value;
                    setEditData(prev => ({ ...prev, services: newServices }));
                  }}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">זמינות שבועית</h3>
        
        <div className="space-y-3">
          {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
            <div key={day} className="flex items-center gap-4 p-3 bg-white/50 rounded-xl border-2 border-orange-200">
              <span className="font-medium text-gray-700">{day}</span>
              <input
                type="checkbox"
                checked={editData.availability.some(slot => slot.startsWith && slot.startsWith(day))}
                onChange={(e) => {
                  if (e.target.checked) {
                    setEditData(prev => ({
                      ...prev,
                      availability: [...prev.availability, `${day}:09:00:18:00`]
                    }));
                  } else {
                    setEditData(prev => ({
                      ...prev,
                      availability: prev.availability.filter(d => !d.startsWith || !d.startsWith(day))
                    }));
                  }
                }}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
              />
              {editData.availability.some(slot => slot.startsWith && slot.startsWith(day)) && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value="09:00"
                    className="px-2 py-1 border border-orange-300 rounded text-sm"
                  />
                  <span className="text-sm text-gray-600">עד</span>
                  <input
                    type="time"
                    value="18:00"
                    className="px-2 py-1 border border-orange-300 rounded text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all font-semibold shadow-lg"
        >
          שמור שינויים
        </button>
      </div>

    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">שינוי סיסמה</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה נוכחית</label>
            <input
              type="password"
              value={editData.currentPassword}
              onChange={(e) => setEditData(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה חדשה</label>
            <input
              type="password"
              value={editData.newPassword}
              onChange={(e) => setEditData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">אימות סיסמה חדשה</label>
            <input
              type="password"
              value={editData.confirmPassword}
              onChange={(e) => setEditData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all font-semibold shadow-lg"
          >
            שמור שינויים
          </button>
        </div>
      </div>
    </div>
  );

  const renderReviewsRequestsTab = () => (
    <div className="space-y-6">
      {/* My Requests */}
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">הבקשות שלי</h3>
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">עדיין לא יצרת בקשות</p>
          <p className="text-sm mt-1">בקשות שתיצור יופיעו כאן</p>
        </div>
      </div>

      {/* My Reviews */}
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">הביקורות שלי</h3>
        <div className="text-center py-8 text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">עדיין לא כתבת ביקורות</p>
          <p className="text-sm mt-1">ביקורות שתכתוב על סיטרים יופיעו כאן</p>
        </div>
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-6">
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900">פרטי בנק</h3>
          {bankAccounts.length < 2 && (
            <button
              onClick={() => setBankAccounts(prev => [
                ...prev,
                { 
                  id: Date.now().toString(), 
                  accountHolderName: '', 
                  accountNumber: '', 
                  bankName: '', 
                  isActive: false, 
                  isEditing: true 
                }
              ])}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg"
            >
              + הוסף חשבון בנק
            </button>
          )}
        </div>
        
        {/* No bank accounts warning */}
        {bankAccounts.filter(account => account.accountHolderName && account.accountNumber && account.bankName).length === 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
            <h4 className="font-semibold text-red-900 mb-2">⚠️ אין פרטי בנק במערכת</h4>
            <p className="text-sm text-red-800">
              לא תוכל לקבל תשלומים עבור השירותים שלך ללא פרטי בנק. אנא הוסף חשבון בנק.
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          {bankAccounts.map((account, index) => (
            <div key={account.id} className={`p-4 rounded-xl border-2 ${
              account.isActive ? 'bg-green-50 border-green-200' : 'bg-white/50 border-orange-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">חשבון בנק {index + 1}</h4>
                  {account.isActive && account.accountHolderName && account.accountNumber && account.bankName && (
                    <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                      פעיל
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {!account.isEditing && account.accountHolderName && account.accountNumber && account.bankName && (
                    <>
                      {!account.isActive && (
                        <button
                          onClick={() => setBankAccounts(prev => prev.map(acc => 
                            acc.id === account.id 
                              ? { ...acc, isActive: true }
                              : { ...acc, isActive: false }
                          ))}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
                        >
                          הפעל
                        </button>
                      )}
                      <button
                        onClick={() => setBankAccounts(prev => prev.map(acc => 
                          acc.id === account.id ? { ...acc, isEditing: true } : acc
                        ))}
                        className="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs hover:bg-orange-600 transition-colors"
                      >
                        עריכה
                      </button>
                      <button
                        onClick={() => setBankAccounts(prev => prev.filter(acc => acc.id !== account.id))}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                      >
                        מחק
                      </button>
                    </>
                  )}
                  {account.isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (account.accountHolderName && account.accountNumber && account.bankName) {
                            setBankAccounts(prev => prev.map(acc => 
                              acc.id === account.id 
                                ? { ...acc, isEditing: false, isActive: prev.filter(a => a.isActive).length === 0 }
                                : acc
                            ));
                          }
                        }}
                        disabled={!account.accountHolderName || !account.accountNumber || !account.bankName}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        שמור
                      </button>
                      <button
                        onClick={() => {
                          if (!account.accountHolderName && !account.accountNumber && !account.bankName) {
                            setBankAccounts(prev => prev.filter(acc => acc.id !== account.id));
                          } else {
                            setBankAccounts(prev => prev.map(acc => 
                              acc.id === account.id ? { ...acc, isEditing: false } : acc
                            ));
                          }
                        }}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                      >
                        ביטול
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שם בעל החשבון</label>
                  <input
                    type="text"
                    value={account.accountHolderName}
                    onChange={(e) => setBankAccounts(prev => prev.map(acc => 
                      acc.id === account.id ? { ...acc, accountHolderName: e.target.value } : acc
                    ))}
                    readOnly={!account.isEditing}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      account.isEditing 
                        ? 'border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500' 
                        : 'border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed'
                    }`}
                    placeholder="שם מלא כפי שמופיע בבנק"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מספר חשבון</label>
                  <input
                    type="text"
                    value={account.accountNumber}
                    onChange={(e) => setBankAccounts(prev => prev.map(acc => 
                      acc.id === account.id ? { ...acc, accountNumber: e.target.value } : acc
                    ))}
                    readOnly={!account.isEditing}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      account.isEditing 
                        ? 'border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500' 
                        : 'border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed'
                    }`}
                    placeholder="מספר חשבון בנק"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שם הבנק</label>
                  <select
                    value={account.bankName}
                    onChange={(e) => setBankAccounts(prev => prev.map(acc => 
                      acc.id === account.id ? { ...acc, bankName: e.target.value } : acc
                    ))}
                    disabled={!account.isEditing}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      account.isEditing 
                        ? 'border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500' 
                        : 'border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <option value="">בחר בנק</option>
                    <option value="בנק הפועלים">בנק הפועלים</option>
                    <option value="בנק לאומי">בנק לאומי</option>
                    <option value="בנק דיסקונט">בנק דיסקונט</option>
                    <option value="בנק מזרחי טפחות">בנק מזרחי טפחות</option>
                    <option value="בנק יהב">בנק יהב</option>
                    <option value="בנק אוצר החייל">בנק אוצר החייל</option>
                    <option value="בנק מרכנתיל">בנק מרכנתיל</option>
                    <option value="אחר">אחר</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mt-6">
          <h4 className="font-semibold text-blue-900 mb-2">מידע חשוב</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• פרטי הבנק ישמשו לקבלת תשלומים עבור השירותים שלך</p>
            <p>• המידע מוצפן ומאובטח</p>
            <p>• ניתן לעדכן את הפרטים בכל עת</p>
            <p>• ניתן להוסיף עד 2 חשבונות בנק ולהחליף ביניהם</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelpTab = () => (
    <div className="space-y-6">
      <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">עזרה ותמיכה</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-2">שאלות נפוצות</h4>
            <p className="text-blue-800 text-sm">מצא תשובות לשאלות הנפוצות ביותר</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <h4 className="font-semibold text-green-900 mb-2">צור קשר</h4>
            <p className="text-green-800 text-sm">נתקלת בבעיה? צור איתנו קשר</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Mail className="w-4 h-4" />
                <span>support@dogsitter.co.il</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Phone className="w-4 h-4" />
                <span>03-1234567</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <h4 className="font-semibold text-purple-900 mb-2">מדריך למשתמש</h4>
            <p className="text-purple-800 text-sm">למד איך להשתמש באפליקציה בצורה הטובה ביותר</p>
          </div>

          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
            <h4 className="font-semibold text-orange-900 mb-2">דווח על בעיה</h4>
            <p className="text-orange-800 text-sm">נתקלת בבאג או בעיה טכנית? דווח לנו</p>
          </div>
        </div>
      </div>
    </div>
  );

  const clientTabs = [
    { id: 'profile', label: 'עריכת פרופיל', icon: Edit },
    { id: 'security', label: 'אבטחה ופרטיות', icon: Shield },
    { id: 'reviews-requests', label: 'הביקורות והבקשות שלי', icon: MessageCircle },
    { id: 'help', label: 'עזרה ותמיכה', icon: HelpCircle }
  ];

  const sitterTabs = [
    { id: 'profile', label: 'עריכת פרופיל', icon: Edit },
    { id: 'security', label: 'אבטחה ופרטיות', icon: Shield },
    { id: 'reviews-requests', label: 'הביקורות והבקשות שלי', icon: MessageCircle },
    { id: 'payments', label: 'תשלומים', icon: CreditCard },
    { id: 'help', label: 'עזרה ותמיכה', icon: HelpCircle }
  ];

  const tabs = user?.userType === 'sitter' ? sitterTabs : clientTabs;

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (user?.userType === 'sitter' ? renderSitterEditTab() : renderClientEditTab())}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'reviews-requests' && renderReviewsRequestsTab()}
        {activeTab === 'payments' && user?.userType === 'sitter' && renderPaymentsTab()}
        {activeTab === 'help' && renderHelpTab()}

        {/* Logout Button */}
        <div className="gradient-card rounded-xl shadow-soft border border-white/20 backdrop-blur-xl p-6 mt-6">
          <button
            onClick={logout}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            התנתק
          </button>
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
              הפרטים נשמרו בהצלחה!
            </h3>
            <p className="text-gray-700 font-medium">
              השינויים שלך עודכנו במערכת
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;