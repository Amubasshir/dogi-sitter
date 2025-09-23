import React, { useState, useMemo } from 'react';
import { Users, FileText, Store, ArrowRight } from 'lucide-react';
import { AuthContext, useAuthState } from './hooks/useAuth';
import Header from './components/Layout/Header';
import TopNavigation from './components/Layout/TopNavigation';
import SearchBar from './components/Layout/SearchBar';
import FilterChips from './components/Layout/FilterChips';
import BusinessFilters from './components/Layout/BusinessFilters';
import Footer from './components/Layout/Footer';
import FloatingActionButton from './components/Layout/FloatingActionButton';
import SitterCard from './components/Cards/SitterCard';
import RequestCard from './components/Cards/RequestCard';
import BusinessCard from './components/Cards/BusinessCard';
import ProfileScreen from './components/Profile/ProfileScreen';
import FilterModal from './components/Modals/FilterModal';
import AuthModal from './components/Modals/AuthModal';
import BusinessAuthModal from './components/Modals/BusinessAuthModal';
import BusinessRegistrationForm from './components/Forms/BusinessRegistrationForm';
import BusinessDashboard from './components/Business/BusinessDashboard';
import SitterDetails from './components/Details/SitterDetails';
import RequestDetails from './components/Details/RequestDetails';
import BusinessDetails from './components/Details/BusinessDetails';
import NewRequestForm from './components/Forms/NewRequestForm';
import { mockSitters, mockRequests, mockBusinesses } from './data/mockData';
import { FilterOptions, Sitter, Request, Business, SERVICE_TYPES, BUSINESS_CATEGORIES } from './types';

// State for sitters that updates when new sitters are added
const useDynamicSitters = () => {
  const [sitters, setSitters] = React.useState(mockSitters);
  
  React.useEffect(() => {
    const handleSittersUpdate = () => {
      // Re-read from localStorage and update state
      const storedSitters = localStorage.getItem('registeredSitters');
      if (storedSitters) {
        try {
          const parsed = JSON.parse(storedSitters);
          setSitters([...parsed, ...mockSitters.filter(s => !parsed.find(p => p.id === s.id))]);
        } catch (error) {
          console.error('Error parsing stored sitters:', error);
        }
      }
    };
    
    // Listen for sitters update events
    window.addEventListener('sittersUpdated', handleSittersUpdate);
    
    // Initial load
    handleSittersUpdate();
    
    return () => {
      window.removeEventListener('sittersUpdated', handleSittersUpdate);
    };
  }, []);
  
  return sitters;
};

// Helper function to get status text in Hebrew
const getStatusText = (status: string): string => {
  switch (status) {
    case 'open': return 'פתוח';
    case 'completed': return 'הושלם';
    default: return status;
  }
};

function App() {
  const authState = useAuthState();
  const { user } = authState;
  const dynamicSitters = useDynamicSitters();
  const [activeTab, setActiveTab] = useState<'requests' | 'sitters' | 'businesses'>('requests');
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBusinessAuthModal, setShowBusinessAuthModal] = useState(false);
  const [showBusinessRegistrationForm, setShowBusinessRegistrationForm] = useState(false);
  const [showBusinessDashboard, setShowBusinessDashboard] = useState(false);
  const [showSitterDetails, setShowSitterDetails] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showBusinessDetails, setShowBusinessDetails] = useState(false);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedSitter, setSelectedSitter] = useState<Sitter | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState('');
  const [businessSortBy, setBusinessSortBy] = useState('distance');
  const [registeredBusinessData, setRegisteredBusinessData] = useState<any>(null);
  const [requests, setRequests] = useState(mockRequests);
  const [filters, setFilters] = useState<FilterOptions>({
    neighborhoods: [],
    serviceTypes: [],
    priceRange: [0, 500],
    rating: 0,
    availability: 'all',
    dogSize: [],
    businessCategories: [],
    dateFrom: '',
    dateTo: '',
    timeOfDay: 'all',
    sortBy: 'date_asc',
    experience: [],
    availableDays: []
  });

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.neighborhoods.length > 0 ||
      filters.serviceTypes.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 500 ||
      filters.rating > 0 ||
      filters.availability !== 'all' ||
      filters.dogSize.length > 0 ||
      filters.businessCategories.length > 0 ||
      filters.dateFrom !== '' ||
      filters.dateTo !== '' ||
      filters.timeOfDay !== 'all' ||
      (filters.experience && filters.experience.length > 0) ||
      (filters.availableDays && filters.availableDays.length > 0) ||
      searchQuery.trim() !== ''
    );
  }, [filters, searchQuery]);

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      neighborhoods: [],
      serviceTypes: [],
      priceRange: [0, 500],
      rating: 0,
      availability: 'all',
      dogSize: [],
      businessCategories: [],
      dateFrom: '',
      dateTo: '',
      timeOfDay: 'all',
      sortBy: 'date_asc',
      experience: [],
      availableDays: []
    });
    setSearchQuery('');
    setSelectedBusinessCategory('');
  };

  const removeFilter = (filterType: string, value?: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'status':
          newFilters.availability = 'all';
          break;
        case 'neighborhood':
          if (value) {
            newFilters.neighborhoods = prev.neighborhoods.filter(n => n !== value);
          }
          break;
        case 'serviceType':
          if (value) {
            newFilters.serviceTypes = prev.serviceTypes.filter(s => s !== value);
          }
          break;
        case 'priceRange':
          newFilters.priceRange = [0, 500];
          break;
        case 'dateFrom':
          newFilters.dateFrom = '';
          break;
        case 'dateTo':
          newFilters.dateTo = '';
          break;
        case 'timeOfDay':
          newFilters.timeOfDay = 'all';
          break;
        case 'rating':
          newFilters.rating = 0;
          break;
        case 'businessCategory':
          if (value) {
            newFilters.businessCategories = prev.businessCategories.filter(c => c !== value);
          }
          break;
        case 'dogSize':
          if (value) {
            newFilters.dogSize = prev.dogSize.filter(s => s !== value);
          }
          break;
      }
      
      return newFilters;
    });
  };

  const removeSearch = () => {
    setSearchQuery('');
  };

  // Always default to requests tab
  const defaultTab = useMemo(() => {
    return 'requests';
  }, []);

  // Update active tab when user type changes
  React.useEffect(() => {
    if (!showProfile) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Filter and search logic
  const filteredSitters = useMemo(() => {
    let filtered = dynamicSitters.filter(sitter => {
      // Search query
      if (searchQuery.trim() && 
          !sitter.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !sitter.neighborhoods.some(n => n.toLowerCase().includes(searchQuery.toLowerCase().trim())) &&
          !sitter.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !sitter.services.some(service => SERVICE_TYPES[service.type]?.toLowerCase().includes(searchQuery.toLowerCase().trim()))) {
        return false;
      }

      // Neighborhood filter
      if (filters.neighborhoods.length > 0 &&
          !filters.neighborhoods.some(n => sitter.neighborhoods.includes(n))) {
        return false;
      }

      // Service type filter
      if (filters.serviceTypes.length > 0 &&
          !filters.serviceTypes.some(s => sitter.services.some(service => service.type === s))) {
        return false;
      }

      // Price filter
      const maxPrice = Math.max(...sitter.services.map(s => s.price));
      if (maxPrice > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && sitter.rating < filters.rating) {
        return false;
      }

      // Experience filter
      if (filters.experience && filters.experience.length > 0 &&
          !filters.experience.includes(sitter.experience)) {
        return false;
      }

      // Available days filter
      if (filters.availableDays && filters.availableDays.length > 0) {
        const sitterDays = sitter.availability?.map(slot => slot.day) || [];
        if (!filters.availableDays.some(day => sitterDays.includes(day))) {
          return false;
        }
      }

      // Time of day filter
      if (filters.timeOfDay && filters.timeOfDay !== 'all' && sitter.availability) {
        const hasMatchingTime = sitter.availability.some(slot => {
          const startHour = parseInt(slot.startTime.split(':')[0]);
          const endHour = parseInt(slot.endTime.split(':')[0]);
          
          switch (filters.timeOfDay) {
            case 'morning':
              return startHour <= 12 && endHour >= 6;
            case 'afternoon':
              return startHour <= 18 && endHour >= 12;
            case 'evening':
              return startHour <= 22 && endHour >= 18;
            default:
              return true;
          }
        });
        
        if (!hasMatchingTime) {
          return false;
        }
      }

      return true;
    });

    // Sort so user's own profile appears first
    if (user?.userType === 'sitter') {
      filtered = filtered.sort((a, b) => {
        const aIsMyProfile = user.id === a.id;
        const bIsMyProfile = user.id === b.id;
        
        if (aIsMyProfile && !bIsMyProfile) return -1;
        if (!aIsMyProfile && bIsMyProfile) return 1;
        return 0;
      });
    }

    // Sort sitters based on sortBy filter
    const sortType = filters.sortBy || 'rating_desc';
    switch (sortType) {
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_asc':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'price_low':
        filtered.sort((a, b) => {
          const aMin = Math.min(...a.services.map(s => s.price));
          const bMin = Math.min(...b.services.map(s => s.price));
          return aMin - bMin;
        });
        break;
      case 'price_high':
        filtered.sort((a, b) => {
          const aMax = Math.max(...a.services.map(s => s.price));
          const bMax = Math.max(...b.services.map(s => s.price));
          return bMax - aMax;
        });
        break;
      case 'experience_desc':
        filtered.sort((a, b) => {
          const experienceOrder = { '10+ שנים': 5, '5+ שנים': 4, '3-5 שנים': 3, '1-2 שנים': 2, 'מתחיל': 1 };
          return (experienceOrder[b.experience as keyof typeof experienceOrder] || 0) - 
                 (experienceOrder[a.experience as keyof typeof experienceOrder] || 0);
        });
        break;
      case 'experience_asc':
        filtered.sort((a, b) => {
          const experienceOrder = { '10+ שנים': 5, '5+ שנים': 4, '3-5 שנים': 3, '1-2 שנים': 2, 'מתחיל': 1 };
          return (experienceOrder[a.experience as keyof typeof experienceOrder] || 0) - 
                 (experienceOrder[b.experience as keyof typeof experienceOrder] || 0);
        });
        break;
      case 'reviews_desc':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      default:
        // Default sort by rating desc
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [searchQuery, filters, dynamicSitters]);

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Search query
      if (searchQuery.trim() && 
          !request.client.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !request.neighborhood.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !request.dog.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !request.serviceType.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !request.dog.breed.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !(request.specialInstructions && request.specialInstructions.toLowerCase().includes(searchQuery.toLowerCase().trim())) &&
          !getStatusText(request.status).toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !(SERVICE_TYPES[request.serviceType as keyof typeof SERVICE_TYPES]?.toLowerCase().includes(searchQuery.toLowerCase().trim()))) {
        return false;
      }

      // Status filter
      // (Status filter removed)

      // Date range filter
      if (filters.dateFrom) {
        const requestDate = new Date(request.date);
        const fromDate = new Date(filters.dateFrom);
        if (requestDate < fromDate) {
          return false;
        }
      }
      
      if (filters.dateTo) {
        const requestDate = new Date(request.date);
        const toDate = new Date(filters.dateTo);
        if (requestDate > toDate) {
          return false;
        }
      }

      // Neighborhood filter
      if (filters.neighborhoods.length > 0 &&
          !filters.neighborhoods.includes(request.neighborhood)) {
        return false;
      }

      // Price filter
      if (request.offeredPrice < filters.priceRange[0] || request.offeredPrice > filters.priceRange[1]) {
        return false;
      }

      // Days filter
      if (filters.availableDays && filters.availableDays.length > 0) {
        const requestDate = new Date(request.date);
        const requestDay = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][requestDate.getDay()];
        if (!filters.availableDays.includes(requestDay)) {
          return false;
        }
      }

      // Time of day filter (using dogSize field temporarily)
      if (filters.timeOfDay && filters.timeOfDay !== 'all') {
        const requestHour = parseInt(request.time.split(':')[0]);
        const timeSlot = filters.timeOfDay;
        
        if (timeSlot === 'morning' && (requestHour < 6 || requestHour >= 12)) {
          return false;
        }
        if (timeSlot === 'afternoon' && (requestHour < 12 || requestHour >= 18)) {
          return false;
        }
        if (timeSlot === 'evening' && (requestHour < 18 || requestHour >= 22)) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, filters, requests]);

  // Sort requests
  const sortedRequests = useMemo(() => {
    const sortType = filters.sortBy || 'date_asc';
    const sorted = [...filteredRequests];
    
    // First sort all requests by the selected criteria
    switch (sortType) {
      case 'date_desc':
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'price_low':
        sorted.sort((a, b) => a.offeredPrice - b.offeredPrice);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.offeredPrice - a.offeredPrice);
        break;
      case 'created_desc':
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'created_asc':
        sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'date_asc': // default
      default:
        sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
    }
    
    // Then put user's own requests first while maintaining the sort order within each group
    const userRequests = sorted.filter(r => r.clientId === user?.id);
    const otherRequests = sorted.filter(r => r.clientId !== user?.id);
    
    return [...userRequests, ...otherRequests];
  }, [filteredRequests, filters.sortBy, user?.id]);

  const filteredBusinesses = useMemo(() => {
    return mockBusinesses.filter(business => {
      // Search query
      if (searchQuery.trim() && 
          !business.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !business.neighborhood.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !business.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !BUSINESS_CATEGORIES[business.category].toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
          !business.services.some(service => service.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))) {
        return false;
      }

      // Neighborhood filter
      if (filters.neighborhoods.length > 0 &&
          !filters.neighborhoods.includes(business.neighborhood)) {
        return false;
      }

      // Business category filter
      if (filters.businessCategories.length > 0 &&
          !filters.businessCategories.includes(business.category)) {
        return false;
      }

      // Selected category filter
      if (selectedBusinessCategory && business.category !== selectedBusinessCategory) {
        return false;
      }

      // Price filter
      const maxPrice = Math.max(...business.services.map(s => s.price));
      if (maxPrice > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && business.rating < filters.rating) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filters, selectedBusinessCategory]);

  // Sort businesses
  const sortedBusinesses = useMemo(() => {
    const sorted = [...filteredBusinesses];
    switch (businessSortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'price_low':
        return sorted.sort((a, b) => {
          const aMin = Math.min(...a.services.map(s => s.price));
          const bMin = Math.min(...b.services.map(s => s.price));
          return aMin - bMin;
        });
      case 'price_high':
        return sorted.sort((a, b) => {
          const aMax = Math.max(...a.services.map(s => s.price));
          const bMax = Math.max(...b.services.map(s => s.price));
          return bMax - aMax;
        });
      case 'newest':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'distance':
      default:
        return sorted; // Default order
    }
  }, [filteredBusinesses, businessSortBy]);

  const handleSitterClick = (sitter: Sitter) => {
    setSelectedSitter(sitter);
    setShowSitterDetails(true);
  };

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
    setShowBusinessDetails(true);
  };

  const handleFABClick = () => {
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (activeTab === 'requests' && authState.userType === 'client') {
      setShowNewRequestForm(true);
    } else if (activeTab === 'sitters' && authState.userType === 'sitter') {
      // Handle availability update
      console.log('Update availability');
    }
  };

  const handleNewRequest = (requestData: any) => {
    console.log('New request:', requestData);
    
    // Create new request object
    const newRequest = {
      id: Date.now().toString(),
      clientId: user?.id || '1',
      client: {
        id: user?.id || '1',
        name: user?.name || 'משתמש',
        email: user?.email || '',
        phone: user?.phone || '',
        profileImage: user?.dogImage, // Use dog image as profile image for now
        userType: 'client' as const,
        neighborhood: user?.neighborhood || '',
        createdAt: new Date(),
        dogs: []
      },
      serviceType: requestData.serviceType,
      date: new Date(requestData.date),
      time: requestData.time,
      dog: {
        id: '1',
        name: requestData.dogName,
        breed: requestData.dogBreed,
        age: requestData.dogAge,
        size: requestData.dogAge <= 2 ? 'small' as const : 
              requestData.dogAge <= 7 ? 'medium' as const : 'large' as const,
        temperament: 'mixed' as const,
        image: user?.dogImage || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        additionalInfo: requestData.additionalInfo
      },
      neighborhood: requestData.neighborhood,
      specialInstructions: requestData.specialInstructions,
      offeredPrice: parseInt(requestData.offeredPrice),
      flexible: requestData.flexible,
      status: 'open' as const,
      createdAt: new Date()
    };
    
    // Add to requests state (in real app this would be API call)
    setRequests(prev => [newRequest, ...prev]);
    
    // Show success message or navigate to requests tab
    setActiveTab('requests');
  };

  // Update existing requests when user profile changes
  React.useEffect(() => {
    if (user) {
      setRequests(prev => prev.map(request => {
        if (request.clientId === user.id) {
          return {
            ...request,
            client: {
              ...request.client,
              name: user.name,
              phone: user.phone
            },
            dog: {
              ...request.dog,
              name: user.dogName || request.dog.name,
              breed: user.dogBreed || request.dog.breed,
              age: user.dogAge || request.dog.age,
              image: user.dogImage || request.dog.image,
              additionalInfo: user.dogInfo || request.dog.additionalInfo
            }
          };
        }
        return request;
      }));
    }
  }, [user?.name, user?.phone, user?.dogName, user?.dogBreed, user?.dogAge, user?.dogImage, user?.dogInfo]);

  const handleBusinessRegistration = (businessData: any) => {
    console.log('New business registration:', businessData);
    // Store the registered business data
    setRegisteredBusinessData(businessData);
    // In a real app, this would make an API call
    // After successful registration, redirect to business dashboard
    setShowBusinessDashboard(true);
  };

  // Check if we should show business dashboard (simulate business login)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('business') === 'dashboard') {
      setShowBusinessDashboard(true);
    } else if (urlParams.get('business') === 'auth') {
      setShowBusinessAuthModal(true);
    } else if (urlParams.get('business') === 'register') {
      setShowBusinessRegistrationForm(true);
    }

    // Listen for business auth event from AuthModal
    const handleOpenBusinessAuth = () => {
      setShowBusinessAuthModal(true);
    };

    // Listen for business registration event from BusinessAuthModal
    const handleOpenBusinessRegistration = () => {
      setShowBusinessRegistrationForm(true);
    };
    
    // Listen for tab change events from registration
    const handleSetActiveTab = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };
    
    window.addEventListener('openBusinessAuth', handleOpenBusinessAuth);
    window.addEventListener('openBusinessRegistration', handleOpenBusinessRegistration);
    window.addEventListener('setActiveTab', handleSetActiveTab as EventListener);

    return () => {
      window.removeEventListener('openBusinessAuth', handleOpenBusinessAuth);
      window.removeEventListener('openBusinessRegistration', handleOpenBusinessRegistration);
      window.removeEventListener('setActiveTab', handleSetActiveTab as EventListener);
    };
  }, []);

  // If showing business dashboard, render it instead of main app
  if (showBusinessDashboard) {
    return <BusinessDashboard 
      business={selectedBusiness} 
      businessData={registeredBusinessData}
    />;
  }

  return (
    <AuthContext.Provider value={authState}>
      <div className="min-h-screen gradient-bg flex flex-col page-transition mobile-safe-top mobile-safe-bottom">
        {/* Header */}
        <Header
          showNotifications={authState.isAuthenticated}
          onNotificationsClick={() => console.log('Show notifications')}
          onAuthClick={() => setShowAuthModal(true)}
          onProfileClick={() => setShowProfile(true)}
        />

        {/* Top Navigation */}
        <TopNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Search Bar - only show for content tabs */}
        {!showProfile && activeTab !== 'businesses' && (
          <SearchBar
            onSearch={setSearchQuery}
            onFilter={() => setShowFilterModal(true)}
            searchQuery={searchQuery}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearAllFilters}
          />
        )}

        {/* Business Filters - only show for businesses tab */}
        {!showProfile && activeTab === 'businesses' && (
          <BusinessFilters
            selectedCategory={selectedBusinessCategory}
            onCategoryChange={setSelectedBusinessCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterClick={() => setShowFilterModal(true)}
            sortBy={businessSortBy}
            onSortChange={setBusinessSortBy}
          />
        )}

        {/* Filter Chips - show for all tabs when filters are active */}
        {!showProfile && hasActiveFilters && (
          <FilterChips
            filters={filters}
            onRemoveFilter={removeFilter}
            onClearAll={clearAllFilters}
            searchQuery={searchQuery}
            onRemoveSearch={removeSearch}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto relative mobile-content mobile-scroll pb-safe">
          {showProfile ? (
            <div className="relative">
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-4 left-4 p-3 glass rounded-full shadow-soft hover:shadow-strong transition-all z-10 float-animation min-w-[48px] min-h-[48px] flex items-center justify-center"
              >
                <ArrowRight className="w-6 h-6 text-gray-600" />
              </button>
              <ProfileScreen />
            </div>
          ) : (
          <div className="max-w-2xl mx-auto py-2 pb-8 px-2">
            {activeTab === 'businesses' ? (
              <div className="space-y-3">
                {sortedBusinesses.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="gradient-card rounded-2xl p-6 shadow-soft mx-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">לא מצאנו התאמות</h3>
                      <p className="text-gray-500 text-base">אפשר לנסות להרחיב סינון או לאפס.</p>
                    </div>
                  </div>
                ) : (
                  sortedBusinesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      onClick={() => handleBusinessClick(business)}
                    />
                  ))
                )}
              </div>
            ) : activeTab === 'sitters' ? (
              <div className="space-y-3">
                {filteredSitters.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="gradient-card rounded-2xl p-6 shadow-soft mx-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">לא מצאנו התאמות</h3>
                      <p className="text-gray-500 text-base">אפשר לנסות להרחיב סינון או לאפס.</p>
                    </div>
                  </div>
                ) : (
                  filteredSitters.map((sitter) => (
                    <SitterCard
                      key={sitter.id}
                      sitter={sitter}
                      onClick={() => handleSitterClick(sitter)}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Create New Request Button - Only for authenticated clients */}
                {authState.isAuthenticated && authState.userType === 'client' && (
                  <div className="mb-4 mx-2">
                    <button
                      onClick={() => setShowNewRequestForm(true)}
                      className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3 text-lg min-h-[56px]"
                    >
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      צור בקשה חדשה
                    </button>
                  </div>
                )}

                {sortedRequests.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="gradient-card rounded-2xl p-6 shadow-soft mx-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">לא מצאנו התאמות</h3>
                      <p className="text-gray-500 text-base">אפשר לנסות להרחיב סינון או לאפס.</p>
                      {authState.isAuthenticated && authState.userType === 'client' && (
                        <button
                          onClick={() => setShowNewRequestForm(true)}
                          className="mt-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-base min-h-[48px]"
                        >
                          צור את הבקשה הראשונה שלך
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  sortedRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onClick={() => handleRequestClick(request)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
          )}
        </div>

        {/* Footer */}
        <Footer />

        {/* Floating Action Button */}

        {/* Modals */}
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={setFilters}
          activeTab={activeTab}
          currentFilters={filters}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />

        <BusinessAuthModal
          isOpen={showBusinessAuthModal}
          onClose={() => setShowBusinessAuthModal(false)}
          onSuccess={() => {
            setShowBusinessAuthModal(false);
            setShowBusinessDashboard(true);
          }}
        />

        <BusinessRegistrationForm
          isOpen={showBusinessRegistrationForm}
          onClose={() => setShowBusinessRegistrationForm(false)}
          onSubmit={handleBusinessRegistration}
        />

        {selectedSitter && (
          <SitterDetails
            sitter={selectedSitter}
            isOpen={showSitterDetails}
            onClose={() => {
              setShowSitterDetails(false);
              setSelectedSitter(null);
            }}
            onContact={() => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                console.log('Contact sitter');
              }
            }}
            onBooking={() => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                console.log('Book sitter');
              }
            }}
          />
        )}

        {selectedRequest && (
          <RequestDetails
            request={selectedRequest}
            isOpen={showRequestDetails}
            onClose={() => {
              setShowRequestDetails(false);
              setSelectedRequest(null);
            }}
            onAccept={() => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                console.log('Accept request');
              }
            }}
            onContact={() => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                console.log('Contact client');
              }
            }}
          />
        )}

        {selectedBusiness && (
          <BusinessDetails
            business={selectedBusiness}
            isOpen={showBusinessDetails}
            onClose={() => {
              setShowBusinessDetails(false);
              setSelectedBusiness(null);
            }}
            onContact={() => {
              window.open(`tel:${selectedBusiness.phone}`);
            }}
            onBooking={() => {
              if (!authState.isAuthenticated) {
                setShowAuthModal(true);
              } else {
                console.log('Book service');
              }
            }}
          />
        )}

        <NewRequestForm
          isOpen={showNewRequestForm}
          onClose={() => setShowNewRequestForm(false)}
          onSubmit={handleNewRequest}
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;