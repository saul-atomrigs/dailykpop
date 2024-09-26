import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { UserSquare } from 'phosphor-react-native';
import { colors, size, spacing, typography } from '@/design-tokens';

export default function CommentList({ comment }) {
  return (
    <View style={styles.comment}>
      <UserSquare size={24} color='black' />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.authorName}>
            {'fan' + comment.author_id.slice(-3) || 'Anonymous'}
          </Text>
        </View>
        <Text style={styles.commentText}>{comment.comment}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: size.lineWidth.micro,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
    marginVertical: spacing.xs,
    borderRadius: size.borderRadius.medium,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  authorName: {
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  commentText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: typography.lineHeight.md,
  },
});