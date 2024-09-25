import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { kpopGroups } from '@/lib/kpopGroups';

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
        <Text>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: 150,
    height: 220,
  },
  confirm: {
    height: 180,
    justifyContent: 'center',
  },
});