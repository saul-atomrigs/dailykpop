import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FeedHeader from '../FeedHeader';

const mockProps = {
  title: 'Test Title',
  content: 'This is a test content',
  image_url: 'https://example.com/image.jpg',
  likes: 10,
  liked: false,
  toggleLike: jest.fn(),
  isAuthenticated: true,
};

describe('FeedHeader Component', () => {
  it('renders correctly with all props', () => {
    const { getByText, getByTestId } = render(<FeedHeader {...mockProps} />);

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('This is a test content')).toBeTruthy();
    expect(getByText('10 Likes')).toBeTruthy();
    expect(getByTestId('feed-header-image')).toBeTruthy();
    expect(getByText('Comments')).toBeTruthy();
  });

  it('renders correctly without image', () => {
    const { queryByTestId } = render(<FeedHeader {...mockProps} image_url={null} />);

    expect(queryByTestId('feed-header-image')).toBeNull();
  });

  it('calls toggleLike when like button is pressed', () => {
    const { getByTestId } = render(<FeedHeader {...mockProps} />);

    fireEvent.press(getByTestId('like-button'));
    expect(mockProps.toggleLike).toHaveBeenCalled();
  });

  it('displays the correct like icon color when liked', () => {
    const { getByTestId, rerender } = render(<FeedHeader {...mockProps} liked={true} />);
    expect(getByTestId('like-icon').props.color).toBe('red');

    rerender(<FeedHeader {...mockProps} liked={false} />);
    expect(getByTestId('like-icon').props.color).toBe('black');
  });
});