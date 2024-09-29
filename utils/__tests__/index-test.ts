import { wait, WIDTH, HEIGHT, rowHasChanged, getMarkedDates, formatDate } from '../index';
import { AgendaSchedule } from 'react-native-calendars';

describe('utils/index.ts', () => {
  test('wait function resolves after specified timeout', async () => {
    const timeout = 1000;
    const start = Date.now();
    await wait(timeout);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(timeout);
  });

  test('WIDTH and HEIGHT are numbers', () => {
    expect(typeof WIDTH).toBe('number');
    expect(typeof HEIGHT).toBe('number');
  });

  test('rowHasChanged function detects changes in text', () => {
    const r1 = { text: 'Hello' };
    const r2 = { text: 'Hello' };
    const r3 = { text: 'World' };
    expect(rowHasChanged(r1, r2)).toBe(false);
    expect(rowHasChanged(r1, r3)).toBe(true);
  });

  test('getMarkedDates function marks all dates in the schedule', () => {
    const items: AgendaSchedule = {
      '2023-10-01': [{ name: 'Event 1' }],
      '2023-10-02': [{ name: 'Event 2' }],
    };
    const markedDates = getMarkedDates(items);
    expect(markedDates).toEqual({
      '2023-10-01': { marked: true },
      '2023-10-02': { marked: true },
    });
  });

  test('formatDate function formats date correctly', () => {
    const date = new Date(2023, 9, 1); // October 1, 2023
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe('2023-10-01');
  });
});