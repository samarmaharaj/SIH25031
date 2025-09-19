
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role: 'citizen' | 'staff') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = {
    citizen: {
        id: 'user-g12345',
        name: 'Alex Doe',
        email: 'alex.doe@example.com',
        photoUrl: 'https://i.pravatar.cc/150?u=alexdoe',
        role: 'citizen' as 'citizen' | 'staff'
    },
    staff: {
        id: 'staff-s67890',
        name: 'Inspector Jane',
        email: 'jane.inspector@citizenconnect.app',
        photoUrl: 'https://i.pravatar.cc/150?u=janeinspector',
        role: 'staff' as 'citizen' | 'staff'
    }
}


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('citizen-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem('citizen-user');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const login = (role: 'citizen' | 'staff') => {
    const userToLogin = mockUsers[role];
    localStorage.setItem('citizen-user', JSON.stringify(userToLogin));
    setUser(userToLogin);
  };
  
  const logout = () => {
    localStorage.removeItem('citizen-user');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
