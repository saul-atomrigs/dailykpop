import React, { type ComponentProps } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors, size, spacing, typography } from '@/design-tokens';

type SocialIconProps = ComponentProps<typeof TouchableOpacity> & {
  backgroundColor: string;
  text?: string;
  onPress: () => void;
};

export default function SocialIcon({
  backgroundColor,
  text,
  onPress,
}: SocialIconProps) {
  return (
    <TouchableOpacity
      style={[styles.socialIcon, { backgroundColor }]}
      onPress={onPress}
      testID="social-icon"
    >
      <Text style={styles.socialText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  socialIcon: {
    padding: spacing.sm,
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: size.borderRadius.xxlarge,
  },
  socialText: {
    fontSize: typography.fontSize.xs,
    alignSelf: 'center',
    fontWeight: typography.fontWeight.bold,
    color: colors.buttonText,
  },
});