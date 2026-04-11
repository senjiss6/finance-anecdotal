import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { database } from '../config/firebase.config';
import { ref, get, set, serverTimestamp } from 'firebase/database';
import { useHistory } from 'react-router-dom';

export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const IOS_CLIENT_ID = import.meta.env.VITE_GOOGLE_IOS_CLIENT_ID || '';
const WEB_CLIENT_ID = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID || '';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const history = useHistory();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('finance_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('finance_user');
      }
    }
    setIsLoading(false);
  }, []);

  const createOrUpdateUserInFirebase = async (
    id: string,
    email: string,
    name: string,
    photoUrl?: string
  ): Promise<User> => {
    const userRef = ref(database, `users/${id}`);
    const snapshot = await get(userRef);

    const userData: User = {
      id,
      email,
      name,
      photoUrl,
      createdAt: snapshot.exists() ? snapshot.val().createdAt : Date.now(),
    };

    if (!snapshot.exists()) {
      // Create new user
      await set(userRef, {
        email: userData.email,
        name: userData.name,
        photoUrl: userData.photoUrl,
        createdAt: serverTimestamp(),
      });
    }

    return userData;
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);

      // Initialize with Google options
      await SocialLogin.initialize({
        google: {
          // iOSClientId: IOS_CLIENT_ID,
          webClientId: WEB_CLIENT_ID,
        },
      });

      const result = await SocialLogin.login({
        provider: 'google',
        options: {},
      });

      if (result.result && result.result.responseType === 'online') {
        const profile = result.result.profile;
        if (profile?.id && profile?.email) {
          const userData = await createOrUpdateUserInFirebase(
            profile.id,
            profile.email,
            profile.name || 'User',
            profile.imageUrl || undefined
          );

          setUser(userData);
          localStorage.setItem('finance_user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SocialLogin.logout({ provider: 'google' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('finance_user');
      
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
