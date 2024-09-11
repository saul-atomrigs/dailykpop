import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppleLogin from '@/components/buttons/AppleLogin';
import GoogleLogin from '@/components/buttons/GoogleLogin';

export default function LoginPage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <AppleLogin />
        <GoogleLogin />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10, // Adds spacing between the buttons
  },
});
