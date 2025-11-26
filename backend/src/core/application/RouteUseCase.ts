import { Route, RouteComparison } from '../domain/Route';
import { RouteServicePort, RouteRepository } from '../ports/inbound/RouteService';
import { TARGET_INTENSITY_2025 } from '../domain/Compliance';

export class RouteUseCase implements RouteServicePort {
  constructor(private routeRepository: RouteRepository) {}

  async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }

  async setBaseline(routeId: string): Promise<Route> {
    // First, unset all baselines
    const allRoutes = await this.routeRepository.findAll();
    for (const route of allRoutes) {
      if (route.isBaseline && route.routeId !== routeId) {
        // In a real implementation, we'd have an update method
        // For now, we'll handle this in the repository
      }
    }
    return this.routeRepository.setBaseline(routeId);
  }

  async getComparison(): Promise<RouteComparison[]> {
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route set');
    }

    const allRoutes = await this.routeRepository.findAll();
    const comparisons: RouteComparison[] = [];

    for (const route of allRoutes) {
      if (route.id === baseline.id) continue;

      const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = route.ghgIntensity <= TARGET_INTENSITY_2025;

      comparisons.push({
        route,
        baseline,
        percentDiff,
        compliant,
      });
    }

    return comparisons;
  }
}



