import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, size, spacing, typography } from '@/design-tokens';

export default function GoogleLogin() {
  GoogleSignin.configure();
  const [userInfo, setUserInfo] = useState<any>(null); // Updated state variable

  const signIn = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@dailykpop-user');

      if (!storedUser) {
        console.log('Attempting to sign in with Google');
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        console.log('Response from Google Signin:', response);

        if (isSuccessResponse(response) && response.data?.user) {
          console.log('response', response);
          console.log('response.user', response.data.user);
          const user = response.data.user; // Store user data from the response
          setUserInfo(user); // Update state with user info
          await AsyncStorage.setItem('@dailykpop-user', user.id); // Save user ID to AsyncStorage
          console.log('User successfully signed in:', user);
        } else {
          console.log('Sign in cancelled');
        }
      } else {
        console.log('User already signed in:', storedUser);
      }
    } catch (error) {
      console.log('Error with Google Signin:', error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log('Operation already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play services not available or outdated');
            break;
          default:
            console.log('Some other error occurred');
        }
      } else {
        console.log('An error that is not related to Google Signin occurred');
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUserInfo(null); // Clear the state after sign-out
      console.log('User signed out');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  return (
    <>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn()}
      />
      <Button title='Sign Out' onPress={() => signOut()} />
    </>
  );
}
