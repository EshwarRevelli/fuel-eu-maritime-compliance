import { PrismaClient } from '@prisma/client';
import { Route } from '../../../core/domain/Route';
import { RouteRepository as IRouteRepository } from '../../../core/ports/inbound/RouteService';

export class PrismaRouteRepository implements IRouteRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Route[]> {
    const routes = await this.prisma.route.findMany({
      orderBy: { year: 'desc' },
    });
    return routes.map(this.toDomain);
  }

  async findById(id: string): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({ where: { id } });
    return route ? this.toDomain(route) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const route = await this.prisma.route.findUnique({ where: { routeId } });
    return route ? this.toDomain(route) : null;
  }

  async setBaseline(routeId: string): Promise<Route> {
    // First, unset all baselines
    await this.prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false },
    });

    // Set the new baseline
    const route = await this.prisma.route.update({
      where: { routeId },
      data: { isBaseline: true },
    });

    return this.toDomain(route);
  }

  async findBaseline(): Promise<Route | null> {
    const route = await this.prisma.route.findFirst({
      where: { isBaseline: true },
    });
    return route ? this.toDomain(route) : null;
  }

  private toDomain(route: any): Route {
    return {
      id: route.id,
      routeId: route.routeId,
      vesselType: route.vesselType,
      fuelType: route.fuelType,
      year: route.year,
      ghgIntensity: route.ghgIntensity,
      fuelConsumption: route.fuelConsumption,
      distance: route.distance,
      totalEmissions: route.totalEmissions,
      isBaseline: route.isBaseline,
    };
  }
}



