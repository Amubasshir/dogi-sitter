import React, { useState } from "react";
import {
  X,
  Heart,
  LogIn,
  UserPlus,
  User,
  Dog,
  Building,
  FileText,
  MapPin,
  DollarSign,
  Calendar,
  CreditCard,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { NEIGHBORHOODS } from "../../types";
import { addSitterToStorage } from "../../data/mockData";
import { supabase } from "../../lib/supabaseClient";
import OtpModal from "./OtpModal";
import toast from "react-hot-toast";
import { addClientDog, registerClientProfile, registerSitterProfile } from "../../lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  setActiveTab?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  setActiveTab,
}) => {
  const { login, user } = useAuth();
  const [step, setStep] = useState<"choice" | "client" | "sitter" | "login">(
    "choice"
  );
  const [sitterStep, setSitterStep] = useState(1);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    // both common
    name: "",
    email: "",
    phone: "",
    userType: "client" as "client" | "sitter",
    password: "",
    isVerified: false,
    userId: "",

    // Client specific
    dogName: "", //! client
    dogBreed: "", //! client
    dogAge: "", //! client
    dogInfo: "", //! client
    dogImage: null as File | null, //! client
    // Sitter specific
    description: "",
    experience: "1-2 שנים",
    neighborhoods: [] as string[],
    allNeighborhoods: false,
    availability: [] as string[],
    services: [{ id: "1", name: "", price: 0, description: "" }],
    // Bank details for step 6
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    agreeToTerms: false,
  });

  console.log({ formData, user, step });

  if (!isOpen) return null;

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

      // Update formData with the uploaded image URL
      setFormData((prev) => ({ ...prev, [field]: url }));
    } catch (err: any) {
      console.error("File upload error:", err.message);
    }
  };

  const handleSubmit = async () => {
    console.log("i am consoled 1");
    const userData = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      userType: formData.userType,
      createdAt: new Date(),
      // Client specific data
      dogName: formData.dogName,
      dogBreed: formData.dogBreed,
      dogAge: parseInt(formData.dogAge) || 0,
      dogInfo: formData.dogInfo,
      dogImage: formData.dogImage || undefined,
      // Sitter specific data
      description: formData.description,
      experience: formData.experience,
      neighborhoods: formData.neighborhoods,
      services: formData.services,
      // Bank details
      accountHolderName: formData.accountHolderName,
      accountNumber: formData.accountNumber,
      bankName: formData.bankName,
    };
    console.log("i am consoled 2");

    // console.log({userData})
    if (step === "client") {
        console.log("client console")
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password || crypto.randomUUID(),
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
            user_type: userData.userType,
          },
        },
      });

      console.log({ data, error });
      if (error) return;
      toast("נשלח אימייל לאימות, אנא בדוק את תיבת הדואר הנכנס שלך", {
        icon: "📧",
        duration: 8000,
      });
      setIsOtpModalOpen(true);
    } else if (step === "sitter") {
   

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password || crypto.randomUUID(),
        //   options: { data: formData },
        options: { data: formData },
      });
      console.log({ data, error });
      if (error) return;
      toast("נשלח אימייל לאימות, אנא בדוק את תיבת הדואר הנכנס שלך", {
        icon: "📧",
        duration: 8000,
      });

      setIsOtpModalOpen(true);
      //   addSitterToStorage(sitterData);
    } else {
      login(formData.email, formData.password);

    console.log("login consoled")

    //        if (formData.userType === 'client') {
    //     // Client should see sitters tab
    //     const event = new CustomEvent('setActiveTab', { detail: 'sitters' });
    //     window.dispatchEvent(event);
    //   } else if (formData.userType === 'sitter') {
    //     // Sitter should see requests tab
    //     const event = new CustomEvent('setActiveTab', { detail: 'requests' });
    //     window.dispatchEvent(event);
    //   }
      onSuccess?.();
      onClose();
      resetForm();
    }

    // login(userData);

    // setTimeout(() => {
    //   if (formData.userType === 'client') {
    //     // Client should see sitters tab
    //     const event = new CustomEvent('setActiveTab', { detail: 'sitters' });
    //     window.dispatchEvent(event);
    //   } else if (formData.userType === 'sitter') {
    //     // Sitter should see requests tab
    //     const event = new CustomEvent('setActiveTab', { detail: 'requests' });
    //     window.dispatchEvent(event);
    //   }
    // }, 100);

    // onSuccess?.();
    // onClose();
    // resetForm();
  };

  const resetForm = () => {
    setStep("choice");
    setSitterStep(1);
    setIsOtpModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      userType: "client",
      password: "",
      isVerified: false,
      userId: "",

      dogName: "",
      dogBreed: "",
      dogAge: "",
      dogInfo: "",
      dogImage: null,
      description: "",
      experience: "1-2 שנים",
      neighborhoods: [],
      allNeighborhoods: false,
      availability: [],
      services: [{ id: "1", name: "", price: 0, description: "" }],
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      agreeToTerms: false,
    });
  };

  const handleVerificationSuccess = async (data) => {
    console.log("from auth verify", { data });
    onClose?.();
    resetForm();
    // setFormData((prev) => ({ ...prev, isVerified: true }));
    // resetForm();
                    if(formData.userType === 'client'){
                        const clientData = await registerClientProfile({
                          phone: formData.phone,
                        });
                        if (!clientData) return;
    
                        setTimeout(async () => {
                            await addClientDog({
                                //   client_id: data.user!.id,
                                client_id: data?.user.id,
                                name: formData.dogName,
                                breed: formData.dogBreed,
                                age: Number(formData.dogAge),
                                size: "large",
                                image: formData.dogImage,
                                additional_info: formData.dogInfo,
                        });

                        const event = new CustomEvent('setActiveTab', { detail: 'sitters' });
                        window.dispatchEvent(event);
        

                        // setActiveTab('requests')
                        onSuccess?.();
                        onClose();
                        resetForm();
                    }, 1000);

                    }else if(formData.userType === 'sitter'){
                         
                            await registerSitterProfile({
                            id: data?.user?.id,
                            description: formData.description,
                            experience: formData.experience,
                            neighborhoods: formData.neighborhoods,
                            availability: formData.availability,
                            agree_to_terms: formData.agreeToTerms,
                            phone: formData.phone,
                            all_neighborhoods: formData.allNeighborhoods,
                            services: formData.services,
                            });

                            


                            const event = new CustomEvent('setActiveTab', { detail: 'requests' });
                            window.dispatchEvent(event);
                            onSuccess?.();
                            onClose();
                            resetForm();
                    }

                    
                    resetForm();
                    onSuccess?.();
                    onClose();
  };

  const canSubmitClient = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.dogName.trim() &&
      formData.dogBreed.trim() &&
      formData.dogAge.trim() &&
      formData.dogImage
    );
  };

  const canSubmitLogin = () => {
    return formData.email.trim() && formData.password.trim();
  };

  const canSubmitSitter = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.description.trim().length >= 20 &&
      formData.experience &&
      (formData.allNeighborhoods || formData.neighborhoods.length > 0) &&
      formData.services.length > 0 &&
      formData.services.every((s) => s.name.trim() && s.price >= 20) &&
      formData.availability.length > 0 &&
      formData.agreeToTerms
    );
    formData.accountHolderName.trim() &&
      formData.accountNumber.trim() &&
      formData.bankName.trim() &&
      formData.agreeToTerms;
  };

  const renderChoice = () => (
    <div className="p-6 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
          <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
          ברוכים הבאים לדוגיסיטר
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          הפלטפורמה המובילה לטיפול בכלבים
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* התחברות */}
        <button
          onClick={() => {
            // כאן יהיה לוגיקת התחברות
            console.log("Login clicked");
            setStep("login");
          }}
          className="w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
                התחברות
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                כבר יש לי חשבון? התחבר כאן
              </p>
            </div>
          </div>
        </button>

        {/* הרשמה כבעל כלב */}
        <button
          onClick={() => {
            setFormData((prev) => ({ ...prev, userType: "client" }));
            setStep("client");
          }}
          className="w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
              <Dog className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
                הרשמה כבעל כלב
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                מחפש סיטר לכלב שלך? הירשם כאן
              </p>
            </div>
          </div>
        </button>

        {/* הרשמה כסיטר */}
        <button
          onClick={() => {
            setFormData((prev) => ({ ...prev, userType: "sitter" }));
            setStep("sitter");
          }}
          className="w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="text-right">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
                הרשמה כסיטר
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                רוצה להתחיל לטפל בכלבים? הירשם כאן
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <button
          onClick={() => {
            // Trigger business auth modal
            onClose();
            setTimeout(() => {
              const event = new CustomEvent("openBusinessAuth");
              window.dispatchEvent(event);
            }, 100);
          }}
          className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-xs sm:text-sm flex items-center justify-center gap-1"
        >
          <Building className="w-4 h-4" />
          יש לי עסק? הרשמה כעסק
        </button>
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
          <Dog className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
          הרשמה כבעל כלב
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            אימייל *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סיסמה
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmitLogin()}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base mobile-button"
        >
          הירשם
        </button>
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <button
          onClick={() => setStep("choice")}
          className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-sm sm:text-base"
        >
          חזור לתפריט הראשי
        </button>
      </div>
    </div>
  );

  const renderClientForm = () => (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
          <Dog className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
          הרשמה כבעל כלב
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            שם מלא *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
            placeholder="השם המלא שלך"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            אימייל *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סיסמה
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            טלפון *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
            placeholder="050-1234567"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              שם הכלב *
            </label>
            <input
              type="text"
              value={formData.dogName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dogName: e.target.value }))
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
              placeholder="שם הכלב"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              גזע *
            </label>
            <input
              type="text"
              value={formData.dogBreed}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dogBreed: e.target.value }))
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
              placeholder="גזע הכלב"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            גיל הכלב *
          </label>
          <input
            type="number"
            min="0"
            max="25"
            value={formData.dogAge}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dogAge: e.target.value }))
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
            placeholder="גיל בשנים"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            תמונה של הכלב *
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={(e) =>
              handleFileChange("dogImage", e.target.files?.[0] || null)
            }
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
            required
          />
          <p className="text-xs text-orange-600 mt-2">
            התמונה תוצג לסיטרים כשתיצור בקשה חדשה, כדי שיוכלו לראות איך הכלב שלך
            נראה
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            מידע נוסף על הכלב
          </label>
          <textarea
            value={formData.dogInfo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dogInfo: e.target.value }))
            }
            rows={3}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm resize-none text-sm sm:text-base mobile-form"
            placeholder="מידע נוסף על הכלב (אופציונלי)"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmitClient()}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base mobile-button"
        >
          הירשם
        </button>
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <button
          onClick={() => setStep("choice")}
          className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-sm sm:text-base"
        >
          חזור לתפריט הראשי
        </button>
      </div>
    </div>
  );

  const renderSitterForm = () => (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
          <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          הרשמה כסיטר
        </h2>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>שלב {sitterStep} מתוך 6</span>
            <span className="font-semibold">
              {Math.round((sitterStep / 6) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-2 shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(sitterStep / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {renderSitterStep()}

      <div className="mt-6 sm:mt-8 text-center">
        <div className="flex gap-3 mb-4">
          {sitterStep > 1 && (
            <button
              onClick={() => setSitterStep(sitterStep - 1)}
              className="flex-1 py-3 border-2 border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 transition-colors font-medium"
            >
              הקודם
            </button>
          )}
          {sitterStep < 6 ? (
            <button
              onClick={() => setSitterStep(sitterStep + 1)}
              disabled={!canProceedSitterStep()}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
            >
              הבא
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmitSitter()}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
            >
              הירשם כסיטר
            </button>
          )}
        </div>
        <button
          onClick={() => setStep("choice")}
          className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-sm sm:text-base"
        >
          חזור לתפריט הראשי
        </button>
      </div>
    </div>
  );

  const renderSitterStep = () => {
    switch (sitterStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800">
                פרטים אישיים ובסיסיים
              </h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                שם מלא *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
                placeholder="השם המלא שלך"
                required
              />
              {formData.name &&
                formData.name
                  .trim()
                  .split(" ")
                  .filter((word) => word.length > 0).length < 2 && (
                  <p className="text-red-500 text-xs mt-1">
                    יש להזין שם פרטי ושם משפחה
                  </p>
                )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                אימייל *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
                placeholder="your@email.com"
                required
              />
              {formData.email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <p className="text-red-500 text-xs mt-1">
                    כתובת אימייל לא תקינה
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סיסמה
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm text-sm sm:text-base mobile-form"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                טלפון *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
                placeholder="050-1234567"
                required
              />
              {formData.phone &&
                !/^05\d{8}$/.test(formData.phone.replace(/[-\s]/g, "")) && (
                  <p className="text-red-500 text-xs mt-1">
                    מספר טלפון לא תקין (05XXXXXXXX)
                  </p>
                )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800">תיאור ועיסוק</h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                תיאור אישי *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                maxLength={200}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm resize-none"
                placeholder="ספר על עצמך כדי שבעלי כלבים יכירו אותך וירצו לקבל את השירותים שלך. תאר את הניסיון שלך, מה מיוחד בך כסיטר ומדוע כדאי לבחור בך (לפחות 20 תווים)"
                required
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.description.length}/200 תווים
              </div>
              {formData.description &&
                formData.description.trim().length < 20 && (
                  <p className="text-red-500 text-xs mt-1">
                    התיאור חייב להכיל לפחות 20 תווים
                  </p>
                )}
              {formData.description &&
                formData.description.trim().length > 200 && (
                  <p className="text-red-500 text-xs mt-1">
                    התיאור לא יכול להכיל יותר מ-200 תווים
                  </p>
                )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ניסיון *
              </label>
              <select
                value={formData.experience}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all shadow-sm"
                required
              >
                <option value="">בחר רמת ניסיון</option>
                <option value="מתחיל">מתחיל</option>
                <option value="1-2 שנים">1-2 שנים</option>
                <option value="3-5 שנים">3-5 שנים</option>
                <option value="5+ שנים">5+ שנים</option>
                <option value="10+ שנים">10+ שנים</option>
              </select>
              {!formData.experience && (
                <p className="text-red-500 text-xs mt-1">יש לבחור רמת ניסיון</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800">אזורי שירות</h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                באילו שכונות אתה מוכן לתת שירות? *
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 bg-white/50 rounded-xl border-2 border-orange-200">
                <label className="flex items-center gap-3 cursor-pointer col-span-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                  <input
                    type="checkbox"
                    checked={formData.allNeighborhoods}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        allNeighborhoods: e.target.checked,
                      }));
                    }}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span className="text-sm font-bold text-orange-800">
                    כל השכונות בעיר
                  </span>
                </label>
                {NEIGHBORHOODS.map((neighborhood) => (
                  <label
                    key={neighborhood}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      disabled={formData.allNeighborhoods}
                      checked={formData.neighborhoods.includes(neighborhood)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            neighborhoods: [
                              ...prev.neighborhoods,
                              neighborhood,
                            ],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            neighborhoods: prev.neighborhoods.filter(
                              (n) => n !== neighborhood
                            ),
                          }));
                        }
                      }}
                      className={`rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-4 h-4 ${
                        formData.allNeighborhoods ? "opacity-50" : ""
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.allNeighborhoods
                          ? "text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {neighborhood}
                    </span>
                  </label>
                ))}
              </div>
              <div className="text-right text-xs text-orange-600 mt-1">
                {formData.allNeighborhoods
                  ? "נבחר: כל השכונות בעיר"
                  : `בחרת ${formData.neighborhoods.length} שכונות`}
              </div>
              {!formData.allNeighborhoods &&
                formData.neighborhoods.length === 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    יש לבחור לפחות שכונה אחת או לסמן "כל השכונות בעיר"
                  </p>
                )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800">
                שירותים ומחירים
              </h3>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  השירותים שלך *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      services: [
                        ...prev.services,
                        {
                          id: Date.now().toString(),
                          name: "",
                          price: 0,
                          description: "",
                        },
                      ],
                    }))
                  }
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  + הוסף שירות
                </button>
              </div>
              <div className="text-sm text-orange-600 mb-4">
                יש להוסיף לפחות שירות אחד עם שם ומחיר
              </div>
              <div className="space-y-3">
                {formData.services.map((service, index) => (
                  <div
                    key={service.id}
                    className="p-4 bg-white/50 rounded-xl border-2 border-orange-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">שירות {index + 1}</h5>
                        {formData.services.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                services: prev.services.filter(
                                  (_, i) => i !== index
                                ),
                              }))
                            }
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <input
                        min="20"
                        placeholder="שם השירות (לדוגמה: הליכה 30 דקות)"
                        value={service.name || ""}
                        onChange={(e) => {
                          const newServices = [...formData.services];
                          newServices[index].name = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            services: newServices,
                          }));
                        }}
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="מחיר"
                          value={service.price}
                          onChange={(e) => {
                            const newServices = [...formData.services];
                            newServices[index].price =
                              parseInt(e.target.value) || 0;
                            setFormData((prev) => ({
                              ...prev,
                              services: newServices,
                            }));
                          }}
                          className="w-24 px-3 py-2 border border-orange-300 rounded-lg text-center focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                        <span className="text-sm text-gray-600">₪</span>
                      </div>

                      <input
                        type="text"
                        placeholder="תיאור השירות (אופציונלי)"
                        value={service.description || ""}
                        onChange={(e) => {
                          const newServices = [...formData.services];
                          newServices[index].description = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            services: newServices,
                          }));
                        }}
                        className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {service.price > 0 && service.price < 20 && (
                        <p className="text-red-500 text-xs mt-1">
                          מחיר מינימלי: 20 ₪
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {formData.services.length === 0 ||
                (!formData.services.every(
                  (s) => s.name.trim() && s.price >= 20
                ) && (
                  <p className="text-red-500 text-xs mt-1">
                    יש להוסיף לפחות שירות אחד מלא עם שם ומחיר מעל 20 ₪
                  </p>
                ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800">זמינות שבועית</h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                באילו ימים אתה זמין לתת שירות? *
              </label>
              <div className="space-y-3">
                {["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"].map(
                  (day) => (
                    <div
                      key={day}
                      className="flex items-center gap-4 p-3 bg-white/50 rounded-xl border-2 border-orange-200"
                    >
                      <span className="font-medium text-gray-700">{day}</span>
                      <input
                        type="checkbox"
                        checked={formData.availability.some((slot) =>
                          slot.startsWith(day)
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              availability: [
                                ...prev.availability,
                                `${day}:09:00:18:00`,
                              ],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              availability: prev.availability.filter(
                                (d) => !d.startsWith(day)
                              ),
                            }));
                          }
                        }}
                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
                      />
                      {formData.availability.some((slot) =>
                        slot.startsWith(day)
                      ) && (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={(() => {
                              const slot = formData.availability.find((slot) =>
                                slot.startsWith(day)
                              );
                              if (!slot) return "09:00";
                              const parts = slot.split(":");
                              return parts.length >= 3
                                ? `${parts[1]}:${parts[2]}`
                                : "09:00";
                            })()}
                            onChange={(e) => {
                              const currentSlot = formData.availability.find(
                                (slot) => slot.startsWith(day)
                              );
                              const parts = currentSlot?.split(":");
                              const endTime =
                                parts && parts.length >= 5
                                  ? `${parts[3]}:${parts[4]}`
                                  : "18:00";
                              const newSlot = `${day}:${e.target.value}:${endTime}`;
                              setFormData((prev) => ({
                                ...prev,
                                availability: prev.availability.map((slot) =>
                                  slot.startsWith(day) ? newSlot : slot
                                ),
                              }));
                            }}
                            className="px-2 py-1 border border-orange-300 rounded text-sm"
                          />
                          <span className="text-sm text-gray-600">עד</span>
                          <input
                            type="time"
                            value={(() => {
                              const slot = formData.availability.find((slot) =>
                                slot.startsWith(day)
                              );
                              if (!slot) return "18:00";
                              const parts = slot.split(":");
                              return parts.length >= 5
                                ? `${parts[3]}:${parts[4]}`
                                : "18:00";
                            })()}
                            onChange={(e) => {
                              const currentSlot = formData.availability.find(
                                (slot) => slot.startsWith(day)
                              );
                              const parts = currentSlot?.split(":");
                              const startTime =
                                parts && parts.length >= 3
                                  ? `${parts[1]}:${parts[2]}`
                                  : "09:00";
                              const newSlot = `${day}:${startTime}:${e.target.value}`;
                              setFormData((prev) => ({
                                ...prev,
                                availability: prev.availability.map((slot) =>
                                  slot.startsWith(day) ? newSlot : slot
                                ),
                              }));
                            }}
                            className="px-2 py-1 border border-orange-300 rounded text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
              {formData.availability.length === 0 && (
                <p className="text-red-500 text-xs mt-1">
                  יש לבחור לפחות יום אחד
                </p>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-800">סיכום ואישור</h3>
            </div>
            <div className="bg-white/50 rounded-xl p-4 border-2 border-orange-200">
              <h4 className="font-semibold text-gray-800 mb-3">
                סיכום הפרטים שלך:
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">שם:</span> {formData.name}
                </p>
                <p>
                  <span className="font-medium">אימייל:</span> {formData.email}
                </p>
                <p>
                  <span className="font-medium">טלפון:</span> {formData.phone}
                </p>
                <p>
                  <span className="font-medium">ניסיון:</span>{" "}
                  {formData.experience}
                </p>
                <p>
                  <span className="font-medium">שכונות:</span>{" "}
                  {formData.allNeighborhoods
                    ? "כל השכונות בעיר"
                    : formData.neighborhoods.join(", ")}
                </p>
                <div>
                  <span className="font-medium">שירותים:</span>
                  <div className="mr-4 mt-1 space-y-1">
                    {formData.services.map((service, index) => (
                      <div key={index} className="text-xs">
                        • {service.name} - ₪{service.price}
                        {service.description && ` (${service.description})`}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">זמינות:</span>
                  <div className="mr-4 mt-1 space-y-1">
                    {formData.availability.map((slot, index) => {
                      const parts = slot.split(":");
                      const day = parts[0];
                      const startTime =
                        parts.length >= 3 ? `${parts[1]}:${parts[2]}` : "09:00";
                      const endTime =
                        parts.length >= 5 ? `${parts[3]}:${parts[4]}` : "18:00";
                      return (
                        <div key={index} className="text-xs">
                          • {day}: {startTime} - {endTime}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <p className="text-sm text-orange-800">
                לאחר ההרשמה תוכל להתחיל לקבל בקשות מבעלי כלבים באזור שלך.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeToTerms: e.target.checked,
                  }))
                }
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
                required
              />
              <label
                htmlFor="agreeToTerms"
                className="text-gray-700 font-medium"
              >
                אני מאשר שהפרטים נכונים ומסכים לתנאי השימוש *
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceedSitterStep = () => {
    switch (sitterStep) {
      case 1:
        return (
          formData.name.trim() &&
          formData.name
            .trim()
            .split(" ")
            .filter((word) => word.length > 0).length >= 2 &&
          formData.email.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
          formData.phone.trim() &&
          /^05\d{8}$/.test(formData.phone.replace(/[-\s]/g, ""))
        );
      case 2:
        return (
          formData.description.trim().length >= 20 &&
          formData.description.trim().length <= 200 &&
          formData.experience
        );
      case 3:
        return formData.allNeighborhoods || formData.neighborhoods.length > 0;
      case 4:
        return (
          formData.services.length > 0 &&
          formData.services.every((s) => s.name.trim() && s.price >= 20)
        );
      case 5:
        return formData.availability.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h1 className="text-lg font-bold text-gray-900">
            {step === "choice" && "ברוכים הבאים"}
            {step === "client" && "הרשמה כבעל כלב"}
            {step === "sitter" && "הרשמה כסיטר"}
          </h1>
          <button
            onClick={() => {
                onClose?.();
                resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {step === "choice" && renderChoice()}
        {step === "client" && renderClientForm()}
        {step === "sitter" && renderSitterForm()}
        {step === "login" && renderLoginForm()}
      </div>

      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={formData.email}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </div>
  );
};

export default AuthModal;
