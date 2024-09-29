import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this import
import EventItem from '../EventItem';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const mockProps = {
  artist: 'Test Artist',
  event: 'Test Event',
  id: 1,
  thumbs_up: 5,
  thumbs_down: 3,
  handleThumbsUp: jest.fn().mockResolvedValue({ thumbsUpCount: 6, thumbsDownCount: 3 }),
  handleThumbsDown: jest.fn().mockResolvedValue({ thumbsUpCount: 5, thumbsDownCount: 4 }),
};

describe('EventItem Component', () => {
  it('renders correctly with all props', () => {
    const { getByTestId } = render(<EventItem {...mockProps} />);

    expect(getByTestId('event-artist').props.children).toBe('Test Artist');
    expect(getByTestId('event-name').props.children).toBe('Test Event');
    expect(getByTestId('thumbs-up-count').props.children).toBe(5);
    expect(getByTestId('thumbs-down-count').props.children).toBe(3);
  });

  it('calls handleThumbsUp when thumbs up button is pressed', async () => {
    const { getByTestId } = render(<EventItem {...mockProps} />);

    fireEvent.press(getByTestId('thumbs-up-button'));
    await waitFor(() => {
      expect(mockProps.handleThumbsUp).toHaveBeenCalledWith(1);
    });
  });

  it('calls handleThumbsDown when thumbs down button is pressed', async () => {
    const { getByTestId } = render(<EventItem {...mockProps} />);

    fireEvent.press(getByTestId('thumbs-down-button'));
    await waitFor(() => {
      expect(mockProps.handleThumbsDown).toHaveBeenCalledWith(1);
    });
  });

  it('updates thumbs up count correctly', async () => {
    const { getByTestId } = render(<EventItem {...mockProps} />);

    fireEvent.press(getByTestId('thumbs-up-button'));
    await waitFor(() => {
      expect(getByTestId('thumbs-up-count').props.children).toBe(6);
    });
  });

  it('updates thumbs down count correctly', async () => {
    const { getByTestId } = render(<EventItem {...mockProps} />);

    fireEvent.press(getByTestId('thumbs-down-button'));
    await waitFor(() => {
      expect(getByTestId('thumbs-down-count').props.children).toBe(4);
    });
  });
});