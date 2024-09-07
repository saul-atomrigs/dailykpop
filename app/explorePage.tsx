import React, { useState } from 'react';
import SocialIcon from '@/components/SocialIcon';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

export default function ExplorePage() {
  const { param } = useLocalSearchParams();

  const xQuery = 'https://x.com/search?q=' + param;
  const youtubeQuery = 'https://www.youtube.com/results?search_query=' + param;
  const redditQuery = 'https://www.reddit.com/search/?q=' + param;
  const newsQuery = 'https://news.google.com/search?q=' + param;

  const [currentUrl, setCurrentUrl] = useState(youtubeQuery);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <SocialIcon
          text='Youtube'
          backgroundColor='red'
          onPress={() => setCurrentUrl(youtubeQuery)}
        />
        <SocialIcon
          text='X'
          backgroundColor='black'
          onPress={() => setCurrentUrl(xQuery)}
        />
        <SocialIcon
          text='reddit'
          backgroundColor='gray'
          onPress={() => setCurrentUrl(redditQuery)}
        />
        <SocialIcon
          text='news'
          backgroundColor='gray'
          onPress={() => setCurrentUrl(newsQuery)}
        />
      </View>

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
