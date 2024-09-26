import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { kpopGroups } from '@/lib/kpopGroups';
import { colors, size, spacing, typography } from '@/design-tokens';

interface WheelPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  onConfirm: () => void;
}

export default function WheelPicker({ selectedValue, onValueChange, onConfirm }: WheelPickerProps) {
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {kpopGroups.map((value, index) => (
          <Picker.Item label={value} value={value} key={index} />
        ))}
      </Picker>
      <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  picker: {
    width: size.block.large,
    height: size.block.xlarge,
  },
  confirm: {
    height: size.block.small,
    justifyContent: 'center',
    backgroundColor: colors.buttonBackground,
    paddingHorizontal: spacing.md,
    borderRadius: size.borderRadius.medium,
  },
  confirmText: {
    color: colors.buttonText,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
});