import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Heart, UserSquare } from 'phosphor-react-native';
import { colors, size, spacing, typography } from '@/design-tokens';

export default function FeedHeader({ title, content, image_url, likes, liked, toggleLike, isAuthenticated }) {
  return (
    <>
      <Text style={styles.title} testID="feed-header-title">{title}</Text>
      <View style={styles.author} testID="feed-header-author">
        <UserSquare size={24} color='black' />
        <Text style={styles.authorText}>Author</Text>
      </View>
      <Text style={styles.content} testID="feed-header-content">{content}</Text>
      {image_url && (
        <Image
          source={{ uri: image_url as string }}
          style={styles.image}
          testID="feed-header-image"
        />
      )}
      <View style={styles.likeContainer} testID="feed-header-like-container">
        <TouchableOpacity
          onPress={toggleLike}
          style={styles.likeButton}
          testID="like-button"
        >
          <Heart size={24} color={liked ? 'red' : 'black'} testID="like-icon" />
          <Text style={styles.likeText} testID="like-text"> {likes} Likes </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.commentTitle} testID="feed-header-comments">Comments</Text>
    </>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  authorText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.md,
    color: colors.textDisabled,
  },
  content: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: size.block.xlarge,
    borderRadius: size.borderRadius.medium,
    marginBottom: spacing.md,
  }, 
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.xxl,
  },
  likeButton: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  likeText: { 
    marginLeft: spacing.xs, 
    fontSize: typography.fontSize.md 
  },
  commentTitle: { 
    fontSize: typography.fontSize.xl, 
    fontWeight: typography.fontWeight.bold, 
    marginBottom: spacing.md 
  },
});