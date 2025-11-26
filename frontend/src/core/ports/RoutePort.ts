import { Route, RouteComparison } from '../domain/Route';

export interface RouteServicePort {
  getAllRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<RouteComparison[]>;
}



