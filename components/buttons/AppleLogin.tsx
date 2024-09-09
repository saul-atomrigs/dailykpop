import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { auth } from '@/firebaseConfig';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';

export default function AppleAuth() {
  const router = useRouter();

  const signInWithApple = async () => {
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
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: identityToken ?? '',
        rawNonce: nonce,
      });

      await signInWithCredential(auth, credential);

      router.push({ pathname: '/', params: { param: auth.currentUser?.uid } });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.googleContainer}>
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
  googleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
