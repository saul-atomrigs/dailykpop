import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { colors, size, typography } from '@/design-tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AddButton: React.FC<ButtonProps> = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: size.block.medium, 
    height: 40,
    backgroundColor: colors.buttonBackground, 
    borderRadius: size.borderRadius.xlarge, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowColor, 
    shadowOffset: { width: size.lineWidth.micro, height: size.lineWidth.micro },
    shadowOpacity: 0.5,
    shadowRadius: size.lineWidth.large,
    elevation: 0.8,
  },
  buttonText: {
    fontSize: typography.fontSize.md, 
    fontWeight: typography.fontWeight.bold, 
    color: colors.buttonText, 
    textDecorationLine: 'underline',
  },
});

export default AddButton;
