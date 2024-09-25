import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommentInput, CommentList, FeedHeader } from '@/components';
import { useDetailedFeed } from '@/hooks';

/**
 * 피드 상세 페이지
 */
export default function DetailedFeed() {
  const {
    title,
    content,
    image_url,
    likes,
    liked,
    comments,
    newComment,
    isAuthenticated,
    toggleLike,
    setNewComment,
    submitComment,
  } = useDetailedFeed();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
          ListHeaderComponent={
            <FeedHeader
              title={title}
              content={content}
              image_url={image_url}
              likes={likes}
              liked={liked}
              toggleLike={toggleLike}
              isAuthenticated={isAuthenticated}
            />
          }
          data={comments}
          renderItem={({ item }) => <CommentList comment={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
        <CommentInput
          newComment={newComment}
          setNewComment={setNewComment}
          submitComment={submitComment}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
});
