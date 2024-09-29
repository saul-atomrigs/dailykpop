import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingIndicator from '../LoadingIndicator';

describe('LoadingIndicator Component', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<LoadingIndicator />);
    const activityIndicator = getByTestId('loading-indicator');

    expect(activityIndicator).toBeTruthy();
  });
});