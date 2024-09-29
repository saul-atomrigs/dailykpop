import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorMessage from '../ErrorMessage';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    FontAwesome: (props: any) => <View {...props} />,
  };
});

describe('ErrorMessage Component', () => {
  it('renders the error message', () => {
    const { getByText } = render(<ErrorMessage message="Something went wrong!" />);
    
    expect(getByText('Something went wrong!')).toBeTruthy();
  });

  it('renders the retry button if onRetry prop is passed', () => {
    const onRetryMock = jest.fn();
    const { getByText } = render(<ErrorMessage message="Error!" onRetry={onRetryMock} />);

    const retryButton = getByText('Retry');
    expect(retryButton).toBeTruthy();

    fireEvent.press(retryButton);
    expect(onRetryMock).toHaveBeenCalled();
  });

  it('does not render the retry button if onRetry prop is not passed', () => {
    const { queryByText } = render(<ErrorMessage message="Error!" />);
    const retryButton = queryByText('Retry');

    expect(retryButton).toBeNull();
  });
});
