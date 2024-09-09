import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { auth } from '@/firebaseConfig';
import {
  GoogleAuthProvider,
  signInWithCredential,
  type User,
} from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const router = useRouter();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const handleSignInWithGoogle = async () => {
    const user = await AsyncStorage.getItem('@dailykpop-user');
    if (!user) {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);

        try {
          const result = await signInWithCredential(auth, credential);
          const userData = result.user;

          await AsyncStorage.setItem(
            '@dailykpop-user',
            JSON.stringify(userData)
          );
          setUserInfo(userData);

          router.push({
            pathname: '/',
            params: { param: userData.uid },
          });
        } catch (error) {
          console.log('Google Sign-In Error: ', error);
        }
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  };

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@dailykpop-user');
    setUserInfo(null);
  };

  return (
    <View>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <Button
        disabled={!request}
        title='Login'
        onPress={() => {
          promptAsync();
        }}
      />
      <Button title='logout' onPress={() => handleLogout()} />
    </View>
  );
}
