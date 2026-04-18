'use client';

import { useState, useCallback } from 'react';
import { authToken } from '../utils/authToken';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !!authToken.get();
  });

  const [username, setUsername] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('quiz_username');
  });

  const logout = useCallback(() => {
    authToken.remove();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quiz_username');
    }
    setIsLoggedIn(false);
    setUsername(null);
  }, []);

  return { isLoggedIn, username, logout };
}
