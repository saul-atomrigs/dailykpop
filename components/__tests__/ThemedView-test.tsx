import React from 'react';
import { render } from '@testing-library/react-native';
import ThemedView from '../ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor');

describe('ThemedView', () => {
  it('renders correctly with light color', () => {
    (useThemeColor as jest.Mock).mockReturnValue('lightColor');

    const { getByTestId } = render(
      <ThemedView lightColor="lightColor" darkColor="darkColor" testID="themed-view" />
    );

    const view = getByTestId('themed-view');
    expect(view.props.style).toContainEqual({ backgroundColor: 'lightColor' });
  });

  it('renders correctly with dark color', () => {
    (useThemeColor as jest.Mock).mockReturnValue('darkColor');

    const { getByTestId } = render(
      <ThemedView lightColor="lightColor" darkColor="darkColor" testID="themed-view" />
    );

    const view = getByTestId('themed-view');
    expect(view.props.style).toContainEqual({ backgroundColor: 'darkColor' });
  });

  it('applies additional styles', () => {
    (useThemeColor as jest.Mock).mockReturnValue('lightColor');

    const { getByTestId } = render(
      <ThemedView lightColor="lightColor" darkColor="darkColor" style={{ padding: 10 }} testID="themed-view" />
    );

    const view = getByTestId('themed-view');
    expect(view.props.style).toContainEqual({ backgroundColor: 'lightColor' });
    expect(view.props.style).toContainEqual({ padding: 10 });
  });
});