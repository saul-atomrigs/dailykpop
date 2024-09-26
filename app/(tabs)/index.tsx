import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PostProps } from '@/types';
import { AddButton, Post, ErrorMessage, LoadingIndicator } from '@/components';
import { useFetchPosts } from '@/hooks';

export default function CommunityPage() {
  const router = useRouter();
  const { posts, loading, error, refetch } = useFetchPosts();

  const renderItem = ({ item }: { item: PostProps['post'] }) => (
    <Post post={item} onPress={navigateToDetailedFeed} />
  );

  const navigateToDetailedFeed = (post: PostProps['post']) => {
    router.push({
      pathname: '/DetailedFeed',
      params: {
        id: post.id,
        title: post.title,
        content: post.content,
        image_url: post.image_url,
        likes: post.likes,
        comments: JSON.stringify(post.comments),
      },
    });
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.addButtonContainer}>
        <AddButton title="Add Feed" onPress={() => router.push('/AddFeed')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: '#eee',
    paddingBottom: 80,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
