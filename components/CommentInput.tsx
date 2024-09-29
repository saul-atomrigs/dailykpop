import React from 'react';
import { TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { PaperPlaneTilt } from 'phosphor-react-native';
import { colors, size, spacing, typography } from '@/design-tokens';

export default function CommentInput({ newComment, setNewComment, submitComment }) {
  return (
    <View style={styles.commentInputContainer}>
      <TextInput
        style={styles.commentInput}
        placeholder='Write a comment...'
        placeholderTextColor={'#555'}
        value={newComment}
        onChangeText={setNewComment}
      />
      <TouchableOpacity
        onPress={submitComment}
        style={styles.sendButton}
        testID="submit-button"
      >
        <PaperPlaneTilt size={24} color='white' />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  commentInputContainer: {
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: size.lineWidth.micro,
    borderTopColor: colors.border,
  },
  commentInput: {
    flex: 1,
    borderWidth: size.lineWidth.micro,
    borderColor: colors.border,
    borderRadius: size.borderRadius.large,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    backgroundColor: colors.inputBackground,
  },
  sendButton: {
    marginLeft: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: size.borderRadius.large,
    padding: spacing.sm,
  },
});