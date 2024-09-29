import { BASE_URL, PLATFORM_NAMES, PLATFORM_COLORS, COMMON_STRINGS } from '../index';

describe('Constants Tests', () => {
  test('BASE_URL should have correct URLs', () => {
    expect(BASE_URL.YOUTUBE).toBe('https://www.youtube.com/results?search_query=');
    expect(BASE_URL.X).toBe('https://x.com/search?q=');
    expect(BASE_URL.REDDIT).toBe('https://www.reddit.com/search/?q=');
    expect(BASE_URL.NEWS).toBe('https://news.google.com/search?q=');
  });

  test('PLATFORM_NAMES should have correct names', () => {
    expect(PLATFORM_NAMES.YOUTUBE).toBe('Youtube');
    expect(PLATFORM_NAMES.X).toBe('X');
    expect(PLATFORM_NAMES.REDDIT).toBe('reddit');
    expect(PLATFORM_NAMES.NEWS).toBe('news');
  });

  test('PLATFORM_COLORS should have correct colors', () => {
    expect(PLATFORM_COLORS.YOUTUBE).toBe('red');
    expect(PLATFORM_COLORS.X).toBe('black');
    expect(PLATFORM_COLORS.REDDIT).toBe('gray');
    expect(PLATFORM_COLORS.NEWS).toBe('gray');
  });

  test('COMMON_STRINGS should have correct strings', () => {
    expect(COMMON_STRINGS.trending).toBe('Trending');
  });
});