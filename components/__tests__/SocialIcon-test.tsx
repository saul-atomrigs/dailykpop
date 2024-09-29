import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SocialIcon from '../SocialIcon';

describe('SocialIcon', () => {
  it('calls the onPress function when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <SocialIcon
        backgroundColor="blue"
        onPress={onPressMock}
        testID="social-icon"
      />
    );

    const button = getByTestId('social-icon');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalled();
  });
});