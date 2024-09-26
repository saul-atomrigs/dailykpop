const ROUTES = {
  DETAILED_FEED: '/DetailedFeed',
  DETAILED_EXPLORE: '/DetailedExplore',
} as const;

export type Routes = typeof ROUTES;
export type RoutePaths = Routes[keyof Routes];

export { ROUTES };