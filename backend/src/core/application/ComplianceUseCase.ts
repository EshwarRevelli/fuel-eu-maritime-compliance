import { ComplianceBalance, AdjustedComplianceBalance, calculateComplianceBalance, TARGET_INTENSITY_2025 } from '../domain/Compliance';
import { ComplianceServicePort, ComplianceRepository } from '../ports/inbound/ComplianceService';
import { RouteRepository } from '../ports/inbound/RouteService';

export class ComplianceUseCase implements ComplianceServicePort {
  constructor(
    private complianceRepository: ComplianceRepository,
    private routeRepository: RouteRepository
  ) {}

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    // Try to get existing CB
    let cb = await this.complianceRepository.getComplianceBalance(shipId, year);

    if (!cb) {
      // Calculate from route data
      const routes = await this.routeRepository.findAll();
      const shipRoutes = routes.filter(r => r.routeId === shipId && r.year === year);

      if (shipRoutes.length === 0) {
        throw new Error(`No routes found for ship ${shipId} in year ${year}`);
      }

      // Sum up CB for all routes of this ship
      let totalCb = 0;
      for (const route of shipRoutes) {
        const routeCb = calculateComplianceBalance(
          TARGET_INTENSITY_2025,
          route.ghgIntensity,
          route.fuelConsumption
        );
        totalCb += routeCb;
      }

      cb = {
        shipId,
        year,
        cbGco2eq: totalCb,
      };

      // Save the calculated CB
      cb = await this.complianceRepository.saveComplianceBalance(cb);
    }

    return cb;
  }

  async getAdjustedComplianceBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance> {
    const adjusted = await this.complianceRepository.getAdjustedComplianceBalance(shipId, year);
    
    if (adjusted) {
      return adjusted;
    }

    // If no adjusted CB exists, return base CB with adjusted = base
    const baseCb = await this.getComplianceBalance(shipId, year);
    return {
      ...baseCb,
      adjustedCbGco2eq: baseCb.cbGco2eq,
    };
  }
}



