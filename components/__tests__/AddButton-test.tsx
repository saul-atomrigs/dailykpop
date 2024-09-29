import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddButton from '../buttons/AddButton';
import { colors, size, typography } from '../../design-tokens';

describe('AddButton', () => {
  it('renders correctly with given title', () => {
    const { getByText } = render(<AddButton title="Add" onPress={() => {}} />);
    const buttonText = getByText('Add');
    expect(buttonText).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<AddButton title="Add" onPress={onPressMock} />);
    const button = getByText('Add');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: colors.primary };
    const customTextStyle = { fontSize: typography.fontSize.xl };
    const { getByText } = render(
      <AddButton title="Add" onPress={() => {}} style={customStyle} textStyle={customTextStyle} />
    );
    const button = getByText('Add').parent;
    expect(getByText('Add').props.style).toContainEqual(customTextStyle);
  });
});