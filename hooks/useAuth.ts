import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/supabaseClient';

interface AuthState {
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    userId: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if there's a session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // If there's a session, get the user ID from AsyncStorage
          const userId = await AsyncStorage.getItem('@dailykpop-user');
          setAuthState({
            userId,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          // If there's no session, the user is not authenticated
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

    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userId = session.user.id;
          await AsyncStorage.setItem('@dailykpop-user', userId);
          setAuthState({
            userId,
            isLoading: false,
            isAuthenticated: true,
          });
        } else if (event === 'SIGNED_OUT') {
          await AsyncStorage.removeItem('@dailykpop-user');
          setAuthState({
            userId: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return authState;
};
