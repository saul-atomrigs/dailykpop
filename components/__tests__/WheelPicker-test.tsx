
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WheelPicker from '../WheelPicker';
import { kpopGroups } from '@/lib/kpopGroups';

describe('WheelPicker', () => {
  const mockOnValueChange = jest.fn();
  const mockOnConfirm = jest.fn();
  const selectedValue = kpopGroups[0];

  it('renders correctly', () => {
    const { getByText } = render(
      <WheelPicker
        selectedValue={selectedValue}
        onValueChange={mockOnValueChange}
        onConfirm={mockOnConfirm}
      />
    );

    expect(getByText('Confirm')).toBeTruthy();
  });

  it('calls onConfirm when the confirm button is pressed', () => {
    const { getByText } = render(
      <WheelPicker
        selectedValue={selectedValue}
        onValueChange={mockOnValueChange}
        onConfirm={mockOnConfirm}
      />
    );

    const confirmButton = getByText('Confirm');
    fireEvent.press(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalled();
  });
});