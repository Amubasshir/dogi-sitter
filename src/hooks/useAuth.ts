import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userType: 'client' | 'sitter' | null;
  login: (user: User) => void;
  logout: () => void;
  setUserType: (type: 'client' | 'sitter') => void;
  // Client specific data
  dogName?: string;
  dogBreed?: string;
  dogAge?: number;
  dogInfo?: string;
  dogImage?: string;
  // Sitter specific data
  description?: string;
  neighborhoods?: string[];
  services?: any[];
  // Bank details
  accountHolderName?: string;
  accountNumber?: string;
  bankName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserTypeState] = useState<'client' | 'sitter' | null>(null);


  
  const loadProfile = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      setUser(null);
      setUserType(null);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, name, email, phone, user_type, neighborhood, created_at, profile_image"
      )
      .eq("id", authUser.id)
      .single();

    if (profile) {
      const mapped: User = {
        id: profile.id,
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        profileImage: profile.profile_image || undefined,
        userType: profile.user_type,
        neighborhood: profile.neighborhood || "",
        createdAt: new Date(profile.created_at),
      };
      setUser(mapped);
      setUserType(profile.user_type);
    }
  };

    useEffect(() => {
    // initial load
    loadProfile();

    // subscribe to auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedUserType) {
      setUserTypeState(savedUserType as 'client' | 'sitter');
    }
  }, []);

  const login = async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log({data})
    if (error) throw error;

    setUser(data?.user);
    localStorage.setItem('user', JSON.stringify(data?.user));
    localStorage.setItem('userType', data?.user?.user_type);
    setUserTypeState(data?.user?.user_type);
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserTypeState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  const setUserType = (type: 'client' | 'sitter') => {
    setUserTypeState(type);
    localStorage.setItem('userType', type);
  };

  return {
    user,
    setUser,
    isAuthenticated: !!user,
    userType,
    login,
    logout,
    setUserType,
    updateUser,
  };
};

export { AuthContext };