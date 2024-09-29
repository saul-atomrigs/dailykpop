import { ROUTES, RoutePaths } from '../index';

describe('ROUTES', () => {
  it('should have the correct paths', () => {
    expect(ROUTES.DETAILED_FEED).toBe('/DetailedFeed');
    expect(ROUTES.EXPLORE_PAGE).toBe('/ExplorePage');
    expect(ROUTES.DETAILED_EXPLORE).toBe('/DetailedExplore');
    expect(ROUTES.LOGIN_PAGE).toBe('/LoginPage');
    expect(ROUTES.ADD_SCHEDULE).toBe('/AddSchedule');
    expect(ROUTES.ADD_FEED).toBe('/AddFeed');
  });

  it('should have the correct type for RoutePaths', () => {
    const paths: RoutePaths[] = [
      '/DetailedFeed',
      '/ExplorePage',
      '/DetailedExplore',
      '/LoginPage',
      '/AddSchedule',
      '/AddFeed',
    ];

    paths.forEach(path => {
      expect(Object.values(ROUTES)).toContain(path);
    });
  });
});