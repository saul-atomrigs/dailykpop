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
import { colors, spacing } from '@/design-tokens';

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
        {/* 화면 상단에 위치한 피드 상세 페이지 UI (댓글 입력창 제외 부분) */}
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
        {/* 화면 하단에 위치한 댓글 달기 입력창 */}
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
    backgroundColor: colors.background,
  },
  container: { 
    flex: 1, 
    padding: spacing.md, 
    backgroundColor: colors.background 
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 80,
  },
});