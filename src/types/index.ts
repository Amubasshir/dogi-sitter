export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  userType: 'client' | 'sitter';
  neighborhood: string;
  createdAt: Date;
  description?: string;
  sitterData?: any;
}

export interface Client extends User {
  userType: 'client';
  dogs: Dog[];
  profileImage?: string;
}

export interface Sitter extends User {
  userType: 'sitter';
  description: string;
  experience: string;
  neighborhoods: string[];
  services: Service[];
  availability: Availability[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  bankDetails?: BankDetails;
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  temperament: 'calm' | 'energetic' | 'mixed';
  image: string;
  additionalInfo?: string;
  allergies?: string;
  specialNeeds?: string;
}

export interface Service {
  id: string;
  type: 'walk_30' | 'walk_60' | 'home_visit';
  price: number;
  description?: string;
}

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Request {
  id: string;
  clientId: string;
  client: Client;
  serviceType: string;
  date: Date;
  time: string;
  dog: Dog;
  neighborhood: string;
  specialInstructions?: string;
  offeredPrice: number;
  flexible: boolean;
  status: 'open' | 'completed';
  createdAt: Date;
}

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  date: Date;
}

export interface FilterOptions {
  neighborhoods: string[];
  serviceTypes: string[];
  priceRange: [number, number];
  rating: number;
  availability: string;
  dogSize: string[];
  businessCategories: string[];
  dateFrom?: string;
  dateTo?: string;
  timeOfDay?: string;
  sortBy?: string;
  experience?: string[];
  availableDays?: string[];
}

export interface Business {
  id: string;
  name: string;
  category: 'pension' | 'veterinary' | 'pet_store' | 'grooming';
  description: string;
  image: string;
  gallery?: string[];
  address: string;
  neighborhood: string;
  phone: string;
  email?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  services: BusinessService[];
  openingHours: OpeningHours[];
  verified: boolean;
  createdAt: Date;
  
  // Core business fields
  logo?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  shortDescription?: string;
  whatsappLink?: string;
  websiteLink?: string;
  specialOffer?: string;
  
  // Pension specific fields
  maxDogs?: number;
  specialConditions?: string;
  additionalServices?: string[];
  
  // Pet Store specific fields
  hasDelivery?: boolean;
  productCategories?: string[];
  deliveryAreas?: string[];
  
  // Trainer specific fields
  trainingTypes?: string[];
  professionalExperience?: string;
  certificates?: string[];
  groupLessons?: boolean;
  privateLessons?: boolean;
  
  // Grooming specific fields
  groomingServices?: string[];
  dogSizeSupport?: string[];
  appointmentRequired?: boolean;
  homeService?: boolean;
  
  // Veterinary specific fields
  emergencyPhone?: string;
  emergencyHours?: string;
  specializations?: string[];
  onlineBooking?: boolean;
  
  // Subscription
  subscriptionType?: 'trial' | 'monthly' | 'yearly';
  subscriptionStatus?: 'active' | 'expired' | 'trial';
}

export interface BusinessService {
  id: string;
  name: string;
  price: number;
  description?: string;
  duration?: string;
}

export interface OpeningHours {
  day: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export const NEIGHBORHOODS = [
  'פלורנטין',
  'נווה צדק',
  'רוטשילד',
  'דיזנגוף',
  'תל אביב צפון',
  'יפו העתיקה',
  'עג׳מי',
  'שפירא',
  'הצפון הישן',
  'מונטיפיורי',
  'לב העיר',
  'שכונת התקווה',
  'רמת אביב',
  'צהלה',
  'אפקה'
];

export const SERVICE_TYPES = {
  walk_30: 'הליכה 30 דק׳',
  walk_60: 'הליכה 60 דק׳',
  home_visit: 'ביקור בית'
};

export const DOG_SIZES = {
  small: 'קטן',
  medium: 'בינוני',
  large: 'גדול'
};

export const BUSINESS_CATEGORIES = {
  pension: 'פנסיון',
  pet_store: 'חנות ציוד ומזון',
  trainer: 'מאלף',
  grooming: 'ספר (טיפוח)',
  veterinary: 'וטרינר',
};

export const SUBSCRIPTION_PLANS = {
  trial: { name: 'ניסיון חינמי', duration: '7 ימים', price: 0, description: 'ניסיון חינמי ל-7 ימים' },
  monthly: { name: 'מנוי חודשי', duration: 'חודש', price: 99, description: 'מנוי חודשי מלא' },
  yearly: { name: 'מנוי שנתי', duration: 'שנה', price: 990, description: 'מנוי שנתי (חיסכון של 20%)' }
};

export const ADDITIONAL_SERVICES = [
  'טיולים',
  'מצלמות',
  'אילוף',
  'תחבורה'
];

export const PRODUCT_CATEGORIES = [
  'מזון יבש',
  'חטיפים',
  'צעצועים',
  'טיפוח',
  'ציוד'
];

export const TRAINING_TYPES = [
  'גורים',
  'בעיות התנהגות',
  'אילוף בסיסי',
  'אילוף מתקדם'
];

export const GROOMING_SERVICES = [
  'תספורת',
  'רחצה',
  'קיצוץ ציפורניים'
];

export const VETERINARY_SERVICES = [
  'חיסונים',
  'בדיקות',
  'טיפולי חירום',
  'עיקור/סירוס'
];