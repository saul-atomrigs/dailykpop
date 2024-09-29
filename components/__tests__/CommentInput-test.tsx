import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CommentInput from '../CommentInput';

describe('CommentInput', () => {
  const mockSetNewComment = jest.fn();
  const mockSubmitComment = jest.fn();

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <CommentInput
        newComment=""
        setNewComment={mockSetNewComment}
        submitComment={mockSubmitComment}
      />
    );
    expect(getByPlaceholderText('Write a comment...')).toBeTruthy();
  });

  it('calls setNewComment on text input change', () => {
    const { getByPlaceholderText } = render(
      <CommentInput
        newComment=""
        setNewComment={mockSetNewComment}
        submitComment={mockSubmitComment}
      />
    );
    const input = getByPlaceholderText('Write a comment...');
    fireEvent.changeText(input, 'New comment');
    expect(mockSetNewComment).toHaveBeenCalledWith('New comment');
  });

  it('calls submitComment on button press', () => {
    const { getByTestId } = render(
      <CommentInput
        newComment=""
        setNewComment={mockSetNewComment}
        submitComment={mockSubmitComment}
      />
    );
    const button = getByTestId('submit-button');
    fireEvent.press(button);
    expect(mockSubmitComment).toHaveBeenCalled();
  });
});