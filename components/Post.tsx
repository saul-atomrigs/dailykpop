import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import type { PostProps } from '@/types';
import { colors, size, spacing, typography } from '@/design-tokens';

const Post: React.FC<PostProps> = ({ post, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(post)}
      testID="post-container"
    >
      <Image
        source={{ uri: post.image_url }}
        style={styles.image}
        testID="post-image"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.content} numberOfLines={2}>
          {post.content}
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="heart" size={16} color="#FF6B6B" />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="comment" size={16} color="#4ECDC4" />
            <Text style={styles.statText}>{post.comments.length}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: size.borderRadius.medium,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.md,
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: size.borderRadius.small,
  },
  image: {
    width: size.block.small,
    height: size.block.small,
    borderRadius: size.borderRadius.medium,
    marginRight: spacing.md,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  content: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.primary,
  },
});

export default Post;
