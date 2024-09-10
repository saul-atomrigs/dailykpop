import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { auth } from '@/firebaseConfig';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppleAuth() {
  const router = useRouter();

  const signInWithApple = async () => {
    const user = await AsyncStorage.getItem('@dailykpop-user');
    if (user) {
      router.push({ pathname: '/', params: { param: user } });
      return;
    }

    try {
      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );

      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      const { identityToken } = appleCredential;
      if (!identityToken) {
        throw new Error('Failed to retrieve identity token');
      }

      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });

      // Sign in with Firebase
      const userCredential = await signInWithCredential(auth, credential);
      console.log('Apple User signed in:', userCredential);

      const userId = auth.currentUser?.uid || '';
      await AsyncStorage.setItem('@dailykpop-user', userId);

      router.push({ pathname: '/', params: { param: auth.currentUser?.uid } });
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        console.log('User canceled the sign-in flow');
      } else if (e.message) {
        console.error('Error during sign-in:', e.message);
      } else {
        console.error('Unknown error during sign-in:', e);
      }
    }
  };

  return (
    <View style={styles.appleContainer}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 50 }}
        onPress={signInWithApple}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
