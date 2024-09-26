import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, size, spacing, typography } from '@/design-tokens';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <FontAwesome name="exclamation-triangle" size={50} color="#FF6B6B" />
      <Text style={styles.errorText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.buttonBackground,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: size.borderRadius.medium,
  },
  retryButtonText: {
    color: colors.buttonText,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
});

export default ErrorMessage;