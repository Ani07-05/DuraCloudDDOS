// src/contexts/UserContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  loginAttempts: number;
  setLoginAttempts: (value: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, loginAttempts, setLoginAttempts }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
