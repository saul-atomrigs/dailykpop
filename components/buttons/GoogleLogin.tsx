import React, { useEffect, useState } from 'react';
import { Button, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
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
import { GoogleLogo } from 'phosphor-react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
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

          await AsyncStorage.setItem('@dailykpop-user', userData.uid);
          console.log('Google User signed in:', userData);

          router.push({
            pathname: '/',
            params: { param: userData.uid },
          });
        } catch (error) {
          console.log('Google Sign-In Error: ', error);
        }
      }
    } else {
      console.log('User already signed in:', user);
    }
  };

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@dailykpop-user');
    router.push({ pathname: '/' });
  };

  return (
    <View style={styles.googleContainer}>
      <TouchableOpacity
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
        style={styles.googleBtn}
      >
        <GoogleLogo
          weight='bold'
          color='red'
          size={20}
          style={styles.googleLogo}
        />
        <Text style={styles.btnText}>Continue with Google</Text>
      </TouchableOpacity>
      <Button title='logout' onPress={() => handleLogout()} />
    </View>
  );
}

const styles = StyleSheet.create({
  googleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: '#fff',
    borderColor: '#7a7a7a',
  },
  googleLogo: {
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
