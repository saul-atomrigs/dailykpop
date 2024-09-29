const ROUTES = {
  DETAILED_FEED: '/DetailedFeed',
  EXPLORE_PAGE: '/ExplorePage',
  DETAILED_EXPLORE: '/DetailedExplore',
  LOGIN_PAGE: '/LoginPage',
  ADD_SCHEDULE: '/AddSchedule',
  ADD_FEED: '/AddFeed',
} as const;

export type Routes = typeof ROUTES;
export type RoutePaths = Routes[keyof Routes];

export { ROUTES };