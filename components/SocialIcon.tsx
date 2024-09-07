import React, { type ComponentProps } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

type SocialIconProps = ComponentProps<typeof TouchableOpacity> & {
  backgroundColor: string;
  text: string;
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
    >
      <Text style={styles.socialText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  socialIcon: {
    padding: 8,
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  socialText: {
    fontSize: 13,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
});
