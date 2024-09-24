import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    userId: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if the user ID is stored in AsyncStorage
        const userId = await AsyncStorage.getItem('@dailykpop-user');

        if (userId) {
          setAuthState({
            userId,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            userId: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthState({
          userId: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = async (userId: string) => {
    try {
      await AsyncStorage.setItem('@dailykpop-user', userId);
      setAuthState({
        userId,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@dailykpop-user');
      setAuthState({
        userId: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  return { ...authState, signIn, signOut };
};

export default useAuth;