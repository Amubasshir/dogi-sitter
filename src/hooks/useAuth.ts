import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

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
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserTypeState] = useState<'client' | 'sitter' | null>(null);

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

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', userData.userType);
    setUserTypeState(userData.userType);
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
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
    isAuthenticated: !!user,
    userType,
    login,
    logout,
    setUserType,
    updateUser,
  };
};

export { AuthContext };