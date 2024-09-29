import React from 'react';
import { render } from '@testing-library/react-native';
import { CalendarPlus, ChatsCircle, Compass } from 'phosphor-react-native';
import { TabBarIcon } from '../navigation/TabBarIcon';

describe('TabBarIcon Component', () => {
  const renderIcon = (name: 'CalendarPlus' | 'ChatsCircle' | 'Compass') =>
    render(<TabBarIcon name={name} />);

  it('renders CalendarPlus icon when name is CalendarPlus', () => {
    const { getByTestId } = renderIcon('CalendarPlus');
    const calendarIcon = getByTestId('CalendarPlusIcon');
    
    expect(calendarIcon).toBeTruthy();
  });

  it('renders ChatsCircle icon when name is ChatsCircle', () => {
    const { getByTestId } = renderIcon('ChatsCircle');
    const chatsIcon = getByTestId('ChatsCircleIcon');
    
    expect(chatsIcon).toBeTruthy();
  });

  it('renders Compass icon when name is Compass', () => {
    const { getByTestId } = renderIcon('Compass');
    const compassIcon = getByTestId('CompassIcon');
    
    expect(compassIcon).toBeTruthy();
  });
});
