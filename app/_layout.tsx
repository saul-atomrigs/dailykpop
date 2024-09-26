import React, { useEffect, useState } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

/** hideAsync가 호출될 때까지 스플래시 스크린을 유지 */
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    setAppIsReady(true);
  }, []);

  useEffect(() => {
    if (appIsReady) {
      /** 스플래시 스크린 제거하고 앱 가동 */
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='LoginPage' options={{ headerShown: false }} />
        <Stack.Screen name='DetailedFeed' options={{ headerShown: false }} />
        <Stack.Screen name='DetailedExplore' options={{ headerShown: false }} />
        <Stack.Screen name='AddFeed' options={{ headerShown: false }} />
        <Stack.Screen name='AddSchedule' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' />
      </Stack>
    </ThemeProvider>
  );
}
