import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Post from '../Post';
import type { PostProps } from '@/types';

// Mock FontAwesome to avoid rendering issues
jest.mock('@expo/vector-icons', () => {
  return {
    FontAwesome: () => {
      return null;
    },
  };
});

const mockPost: PostProps['post'] = {
  id: '1',
  title: 'Test Post',
  content: 'This is a test post content',
  image_url: 'https://example.com/image.jpg',
  likes: 10,
  comments: [{ id: '1', content: 'Test comment' }],
};

const mockOnPress = jest.fn();

describe('Post Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<Post post={mockPost} onPress={mockOnPress} />);

    expect(getByText('Test Post')).toBeTruthy();
    expect(getByText('This is a test post content')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
    expect(getByTestId('post-image')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(<Post post={mockPost} onPress={mockOnPress} />);

    fireEvent.press(getByTestId('post-container'));
    expect(mockOnPress).toHaveBeenCalledWith(mockPost);
  });
});