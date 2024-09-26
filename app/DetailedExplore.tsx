import React, { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { SocialIcon } from '@/components';
import {
  BASE_URL,
  PLATFORM_NAMES,
  PLATFORM_COLORS,
} from '@/constants';

/**
 * KPOP 아이돌 SNS 및 뉴스를 접할 수 있는 페이지
 */
export default function DetailedExplore() {
  const { param } = useLocalSearchParams();
  
  /**
   * 소셜 플랫폼 목록
   */
  const socialPlatforms = useMemo(() => [
    { name: PLATFORM_NAMES.YOUTUBE, baseUrl: BASE_URL.YOUTUBE, color: PLATFORM_COLORS.YOUTUBE },
    { name: PLATFORM_NAMES.X, baseUrl: BASE_URL.X, color: PLATFORM_COLORS.X },
    { name: PLATFORM_NAMES.REDDIT, baseUrl: BASE_URL.REDDIT, color: PLATFORM_COLORS.REDDIT },
    { name: PLATFORM_NAMES.NEWS, baseUrl: BASE_URL.NEWS, color: PLATFORM_COLORS.NEWS },
  ].map(platform => ({
    ...platform,
    url: `${platform.baseUrl}${param}`
  })), [param]);

  const [currentUrl, setCurrentUrl] = useState(socialPlatforms[0].url);

  return (
    <SafeAreaView style={styles.container}>
      {/* 소셜 아이콘 바 */}
      <View style={styles.tabBar}>
        {socialPlatforms.map((platform) => (
          <SocialIcon
            key={platform.name}
            text={platform.name}
            backgroundColor={platform.color}
            onPress={() => setCurrentUrl(platform.url)}
          />
        ))}
      </View>

      {/* sns/뉴스 웹뷰 */}
      <View style={styles.webViewContainer}>
        <WebView style={styles.webView} source={{ uri: currentUrl }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-evenly',
    borderWidth: 0.2,
  },
  socialIcon: {
    padding: 8,
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  socialText: {
    fontSize: 13,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
});
