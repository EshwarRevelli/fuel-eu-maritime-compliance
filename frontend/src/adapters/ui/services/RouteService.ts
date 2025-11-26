import { RouteServicePort } from '../../../core/ports/RoutePort';
import { Route, RouteComparison } from '../../../core/domain/Route';
import { ApiClient } from '../../infrastructure/ApiClient';

export class RouteService implements RouteServicePort {
  constructor(private apiClient: ApiClient) {}

  async getAllRoutes(): Promise<Route[]> {
    return this.apiClient.getAllRoutes();
  }

  async setBaseline(routeId: string): Promise<Route> {
    return this.apiClient.setBaseline(routeId);
  }

  async getComparison(): Promise<RouteComparison[]> {
    return this.apiClient.getComparison();
  }
}



