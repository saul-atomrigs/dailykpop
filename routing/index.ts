const ROUTES = {
  DETAILED_FEED: '/DetailedFeed',
  EXPLORE_PAGE: '/ExplorePage',
} as const;

export type Routes = typeof ROUTES;
export type RoutePaths = Routes[keyof Routes];

export { ROUTES };