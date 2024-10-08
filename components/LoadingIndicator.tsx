import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, size, spacing, typography } from '@/design-tokens';

interface LoadingIndicatorProps {
  color?: string;
  size?: 'small' | 'large';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  color = '#0000ff',
  size = 'large'
}) => {
  return (
    <View style={styles.container} testID='loading-indicator'>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;
