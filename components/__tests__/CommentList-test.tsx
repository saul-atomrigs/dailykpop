import React from 'react';
import { render } from '@testing-library/react-native';
import CommentList from '../CommentList';

// Mock user data
const mockUser = {
  id: '123456',
  username: 'fan456',
};

jest.mock('@/supabaseClient', () => ({
  getUserById: jest.fn((id) => {
    if (id === '123456') {
      return mockUser;
    }
    return { username: 'Anonymous' };
  }),
}));

describe('CommentList', () => {
  it('renders correctly with a comment', () => {
    const comment = {
      author_id: '123456',
      comment: 'This is a test comment',
    };

    const { getByText } = render(<CommentList comment={comment} />);

    expect(getByText('fan456')).toBeTruthy();
    expect(getByText('This is a test comment')).toBeTruthy();
  });
});