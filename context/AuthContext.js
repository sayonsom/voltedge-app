'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange } from '@/lib/auth';
import { apiClient } from '@/lib/api-client';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      
      // Set auth token for API client
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          apiClient.setAuthToken(token);
          console.log('[Auth] Token set for API client');
          
          // Set token refresh callback
          apiClient.setTokenRefreshCallback(async () => {
            const refreshedToken = await firebaseUser.getIdToken(true);
            console.log('[Auth] Token refreshed');
            return refreshedToken;
          });
        } catch (error) {
          console.error('[Auth] Failed to get ID token:', error);
        }
      } else {
        apiClient.clearAuthToken();
        console.log('[Auth] Token cleared');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
