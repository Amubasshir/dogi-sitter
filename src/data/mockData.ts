import { Sitter, Request, Client, Dog, Business } from '../types';

// Function to add a new sitter to storage and update the exported list
export const addSitterToStorage = (sitter: Sitter) => {
  const existingSitters = localStorage.getItem('registeredSitters');
  let sitters = [];
  
  if (existingSitters) {
    try {
      sitters = JSON.parse(existingSitters);
    } catch (error) {
      console.error('Error parsing existing sitters:', error);
    }
  }
  
  sitters.push(sitter);
  localStorage.setItem('registeredSitters', JSON.stringify(sitters));
  
  // Update the exported mockSitters array
  mockSitters.unshift(sitter); // Add to beginning of array
  
  // Trigger a custom event to notify components about the update
  window.dispatchEvent(new CustomEvent('sittersUpdated'));
};

// Function to get sitters from localStorage or use default mock data
const getSittersFromStorage = (): Sitter[] => {
  const storedSitters = localStorage.getItem('registeredSitters');
  if (storedSitters) {
    try {
      const parsed = JSON.parse(storedSitters);
      return [...parsed, ...mockSittersBase]; // Put new sitters first
    } catch (error) {
      console.error('Error parsing stored sitters:', error);
    }
  }
  return mockSittersBase;
};

export const mockDogs: Dog[] = [
  {
    id: '1',
    name: 'מקס',
    breed: 'לברדור',
    age: 3,
    size: 'large',
    temperament: 'energetic',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalInfo: 'אוהב לשחק עם כלבים אחרים'
  },
  {
    id: '2',
    name: 'לונה',
    breed: 'פודל',
    age: 2,
    size: 'medium',
    temperament: 'calm',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    additionalInfo: 'רגועה ונחמדה'
  }
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'דני כהן',
    email: 'danny@example.com',
    phone: '050-1234567',
    userType: 'client',
    neighborhood: 'פלורנטין',
    createdAt: new Date(),
    dogs: [mockDogs[0]]
  },
  {
    id: '2',
    name: 'שרה לוי',
    email: 'sara@example.com',
    phone: '052-9876543',
    userType: 'client',
    neighborhood: 'נווה צדק',
    createdAt: new Date(),
    dogs: [mockDogs[1]]
  }
];

const mockSittersBase: Sitter[] = [
  {
    id: '1',
    name: 'מיכל אברהם',
    email: 'michal@example.com',
    phone: '054-1111111',
    profileImage: undefined,
    userType: 'sitter',
    neighborhood: 'פלורנטין',
    description: 'אוהבת כלבים מגיל צעיר, בעלת ניסיון של 5 שנים בטיפול בכלבים מכל הגדלים',
    experience: '5+ שנים',
    neighborhoods: ['פלורנטין', 'נווה צדק', 'רוטשילד'],
    services: [
      { id: '1', type: 'walk_30', price: 40 },
      { id: '2', type: 'walk_60', price: 70 },
      { id: '3', type: 'home_visit', price: 80 }
    ],
    availability: [
      { day: 'ראשון', startTime: '08:00', endTime: '18:00' },
      { day: 'שני', startTime: '08:00', endTime: '18:00' },
      { day: 'שלישי', startTime: '08:00', endTime: '18:00' }
    ],
    rating: 4.8,
    reviewCount: 23,
    verified: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'יוסי דוד',
    email: 'yossi@example.com',
    phone: '053-2222222',
    profileImage: undefined,
    userType: 'sitter',
    neighborhood: 'דיזנגוף',
    description: 'מאמן כלבים מקצועי עם התמחות בכלבים גדולים ואנרגטיים',
    experience: '8+ שנים',
    neighborhoods: ['דיזנגוף', 'תל אביב צפון', 'רמת אביב'],
    services: [
      { id: '1', type: 'walk_30', price: 50 },
      { id: '2', type: 'walk_60', price: 85 },
      { id: '3', type: 'home_visit', price: 100 }
    ],
    availability: [
      { day: 'ראשון', startTime: '06:00', endTime: '20:00' },
      { day: 'שני', startTime: '06:00', endTime: '20:00' },
      { day: 'רביעי', startTime: '06:00', endTime: '20:00' }
    ],
    rating: 4.9,
    reviewCount: 41,
    verified: true,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'רונית גולן',
    email: 'ronit@example.com',
    phone: '052-3333333',
    profileImage: undefined,
    userType: 'sitter',
    neighborhood: 'יפו העתיקה',
    description: 'מתמחה בכלבים קטנים וגורים, בעלת סבלנות רבה ואהבה אמיתית לבעלי חיים',
    experience: '3-5 שנים',
    neighborhoods: ['יפו העתיקה', 'עג׳מי', 'נווה צדק'],
    services: [
      { id: '1', type: 'walk_30', price: 35 },
      { id: '2', type: 'walk_60', price: 60 },
      { id: '3', type: 'home_visit', price: 75 }
    ],
    availability: [
      { day: 'שני', startTime: '09:00', endTime: '17:00' },
      { day: 'רביעי', startTime: '09:00', endTime: '17:00' },
      { day: 'שישי', startTime: '09:00', endTime: '15:00' }
    ],
    rating: 4.7,
    reviewCount: 18,
    verified: true,
    createdAt: new Date()
  }
];

// Export the dynamic sitters list - initialize as mutable array
export let mockSitters: Sitter[] = getSittersFromStorage();

// Function to update a sitter in the list
export const updateSitterInList = (updatedSitter: Sitter) => {
  const index = mockSitters.findIndex(s => s.id === updatedSitter.id);
  if (index !== -1) {
    mockSitters[index] = updatedSitter;
  }
  
  // Also update localStorage
  const storedSitters = localStorage.getItem('registeredSitters');
  if (storedSitters) {
    try {
      const sitters = JSON.parse(storedSitters);
      const updatedSitters = sitters.map(sitter => 
        sitter.id === updatedSitter.id ? updatedSitter : sitter
      );
      localStorage.setItem('registeredSitters', JSON.stringify(updatedSitters));
    } catch (error) {
      console.error('Error updating sitter in storage:', error);
    }
  }
};

export const mockRequests: Request[] = [
  {
    id: '1',
    clientId: '1',
    client: mockClients[0],
    serviceType: 'walk_30',
    date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    time: '18:00',
    dog: mockDogs[0],
    neighborhood: 'פלורנטין',
    specialInstructions: 'מקס אוהב לרוץ בפארק, אנא הביאו כדור',
    offeredPrice: 45,
    flexible: true,
    status: 'open',
    createdAt: new Date()
  },
  {
    id: '2',
    clientId: 'other-user-1',
    client: mockClients[1],
    serviceType: 'home_visit',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    time: '14:00',
    dog: mockDogs[1],
    neighborhood: 'נווה צדק',
    specialInstructions: 'לונה צריכה תרופה בשעה 15:00',
    offeredPrice: 80,
    flexible: false,
    status: 'open',
    createdAt: new Date()
  },
  {
    id: '3',
    clientId: 'other-user-2',
    client: mockClients[0],
    serviceType: 'walk_60',
    date: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    time: '20:00',
    dog: mockDogs[0],
    neighborhood: 'פלורנטין',
    offeredPrice: 75,
    flexible: true,
    status: 'open',
    createdAt: new Date()
  }
];

export const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'פנסיון כלבים "בית חם"',
    category: 'pension',
    description: 'פנסיון מוסדר ומקצועי לכלבים מכל הגדלים. צוות מנוסה, מתקנים מודרניים ואווירה ביתית.',
    image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400',
    gallery: [
      'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    address: 'רחוב הרצל 45, תל אביב',
    neighborhood: 'פלורנטין',
    phone: '03-1234567',
    email: 'info@beit-cham.co.il',
    rating: 4.7,
    reviewCount: 34,
    services: [
      { id: '1', name: 'לינה יומית', price: 120, description: 'לינה מלאה עם ארוחות ופעילות', duration: 'יום' },
      { id: '2', name: 'חצי יום', price: 70, description: 'שהייה של 4-6 שעות', duration: '4-6 שעות' }
    ],
    openingHours: [
      { day: 'ראשון', isOpen: true, openTime: '07:00', closeTime: '19:00' },
      { day: 'שני', isOpen: true, openTime: '07:00', closeTime: '19:00' },
      { day: 'שלישי', isOpen: true, openTime: '07:00', closeTime: '19:00' },
      { day: 'רביעי', isOpen: true, openTime: '07:00', closeTime: '19:00' },
      { day: 'חמישי', isOpen: true, openTime: '07:00', closeTime: '19:00' },
      { day: 'שישי', isOpen: true, openTime: '07:00', closeTime: '15:00' },
      { day: 'שבת', isOpen: false }
    ],
    verified: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'וטרינר ד"ר כהן',
    category: 'veterinary',
    description: 'מרפאה וטרינרית מתקדמת עם ציוד חדיש. התמחות בכירורגיה ורפואה פנימית.',
    image: 'https://images.pexels.com/photos/6235086/pexels-photo-6235086.jpeg?auto=compress&cs=tinysrgb&w=400',
    address: 'שדרות רוטשילד 12, תל אביב',
    neighborhood: 'רוטשילד',
    phone: '03-9876543',
    email: 'clinic@dr-cohen.co.il',
    rating: 4.9,
    reviewCount: 67,
    services: [
      { id: '1', name: 'בדיקה כללית', price: 180, description: 'בדיקה רפואית מקיפה', duration: '30 דק' },
      { id: '2', name: 'חיסונים', price: 150, description: 'חיסון שנתי מלא', duration: '15 דק' },
      { id: '3', name: 'עקירת שיניים', price: 400, description: 'הליך כירורגי בהרדמה', duration: '60 דק' }
    ],
    openingHours: [
      { day: 'ראשון', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'שני', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'שלישי', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'רביעי', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'חמישי', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'שישי', isOpen: false },
      { day: 'שבת', isOpen: false }
    ],
    verified: true,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'חנות "כל-בו לחיות מחמד"',
    category: 'pet_store',
    description: 'חנות מקצועית למזון, ציוד ואביזרים לכלבים. מבחר ענק של מותגים מובילים.',
    image: 'https://images.pexels.com/photos/4498185/pexels-photo-4498185.jpeg?auto=compress&cs=tinysrgb&w=400',
    address: 'רחוב דיזנגוף 89, תל אביב',
    neighborhood: 'דיזנגוף',
    phone: '03-5555555',
    rating: 4.5,
    reviewCount: 23,
    services: [
      { id: '1', name: 'מזון יבש פרימיום', price: 180, description: 'שק 15 ק"ג' },
      { id: '2', name: 'רצועה מעוצבת', price: 45, description: 'רצועה איכותית' },
      { id: '3', name: 'צעצועים', price: 25, description: 'צעצוע לעיסה' }
    ],
    openingHours: [
      { day: 'ראשון', isOpen: true, openTime: '09:00', closeTime: '20:00' },
      { day: 'שני', isOpen: true, openTime: '09:00', closeTime: '20:00' },
      { day: 'שלישי', isOpen: true, openTime: '09:00', closeTime: '20:00' },
      { day: 'רביעי', isOpen: true, openTime: '09:00', closeTime: '20:00' },
      { day: 'חמישי', isOpen: true, openTime: '09:00', closeTime: '20:00' },
      { day: 'שישי', isOpen: true, openTime: '09:00', closeTime: '15:00' },
      { day: 'שבת', isOpen: false }
    ],
    verified: true,
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'מאלף כלבים "כלב טוב"',
    category: 'trainer',
    description: 'מאלף מקצועי עם ניסיון של 10 שנים. התמחות באילוף בסיסי ותיקון בעיות התנהגות.',
    image: 'https://images.pexels.com/photos/4498185/pexels-photo-4498185.jpeg?auto=compress&cs=tinysrgb&w=400',
    address: 'פארק הירקון, תל אביב',
    neighborhood: 'צפון תל אביב',
    phone: '052-8888888',
    rating: 4.9,
    reviewCount: 28,
    services: [
      { id: '1', name: 'אילוף בסיסי', price: 300, description: 'שיעור פרטי 60 דק', duration: '60 דק' },
      { id: '2', name: 'תיקון בעיות התנהגות', price: 400, description: 'טיפול מותאם אישית', duration: '90 דק' },
      { id: '3', name: 'קורס אילוף קבוצתי', price: 150, description: 'שיעור קבוצתי שבועי', duration: '45 דק' }
    ],
    openingHours: [
      { day: 'ראשון', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'שני', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'שלישי', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'רביעי', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'חמישי', isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { day: 'שישי', isOpen: true, openTime: '08:00', closeTime: '15:00' },
      { day: 'שבת', isOpen: false }
    ],
    verified: true,
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'ספר כלבים "פרווה מושלמת"',
    category: 'grooming',
    description: 'מכון טיפוח מקצועי לכלבים. תספורות, רחצה וטיפוח מלא על ידי מומחים.',
    image: 'https://images.pexels.com/photos/6816861/pexels-photo-6816861.jpeg?auto=compress&cs=tinysrgb&w=400',
    address: 'רחוב אלנבי 67, תל אביב',
    neighborhood: 'לב העיר',
    phone: '03-7777777',
    rating: 4.8,
    reviewCount: 41,
    services: [
      { id: '1', name: 'תספורת מלאה', price: 120, description: 'תספורת + רחצה + ייבוש', duration: '90 דק' },
      { id: '2', name: 'רחצה וייבוש', price: 60, description: 'רחצה עם שמפו מקצועי', duration: '45 דק' },
      { id: '3', name: 'חיתוך ציפורניים', price: 30, description: 'חיתוך מקצועי', duration: '15 דק' }
    ],
    openingHours: [
      { day: 'ראשון', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'שני', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'שלישי', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'רביעי', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'חמישי', isOpen: true, openTime: '09:00', closeTime: '17:00' },
      { day: 'שישי', isOpen: false },
      { day: 'שבת', isOpen: false }
    ],
    verified: true,
    createdAt: new Date()
  }
];