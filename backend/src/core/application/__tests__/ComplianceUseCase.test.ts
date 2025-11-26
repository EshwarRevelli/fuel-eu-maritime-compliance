import { ComplianceUseCase } from '../ComplianceUseCase';
import { ComplianceRepository } from '../../ports/inbound/ComplianceService';
import { RouteRepository } from '../../ports/inbound/RouteService';
import { ComplianceBalance } from '../../domain/Compliance';

describe('ComplianceUseCase', () => {
  let complianceUseCase: ComplianceUseCase;
  let mockComplianceRepository: jest.Mocked<ComplianceRepository>;
  let mockRouteRepository: jest.Mocked<RouteRepository>;

  beforeEach(() => {
    mockComplianceRepository = {
      getComplianceBalance: jest.fn(),
      saveComplianceBalance: jest.fn(),
      getAdjustedComplianceBalance: jest.fn(),
    };

    mockRouteRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByRouteId: jest.fn(),
      setBaseline: jest.fn(),
      findBaseline: jest.fn(),
    };

    complianceUseCase = new ComplianceUseCase(mockComplianceRepository, mockRouteRepository);
  });

  describe('getComplianceBalance', () => {
    it('should return existing CB if found', async () => {
      const existingCb: ComplianceBalance = {
        shipId: 'R001',
        year: 2024,
        cbGco2eq: 1000,
      };

      mockComplianceRepository.getComplianceBalance.mockResolvedValue(existingCb);

      const result = await complianceUseCase.getComplianceBalance('R001', 2024);

      expect(result).toEqual(existingCb);
      expect(mockComplianceRepository.getComplianceBalance).toHaveBeenCalledWith('R001', 2024);
    });

    it('should calculate CB from routes if not found', async () => {
      mockComplianceRepository.getComplianceBalance.mockResolvedValue(null);
      mockRouteRepository.findAll.mockResolvedValue([
        {
          id: '1',
          routeId: 'R001',
          vesselType: 'Container',
          fuelType: 'HFO',
          year: 2024,
          ghgIntensity: 91.0,
          fuelConsumption: 5000,
          distance: 12000,
          totalEmissions: 4500,
          isBaseline: false,
        },
      ]);

      const savedCb: ComplianceBalance = {
        shipId: 'R001',
        year: 2024,
        cbGco2eq: -3400000,
      };
      mockComplianceRepository.saveComplianceBalance.mockResolvedValue(savedCb);

      const result = await complianceUseCase.getComplianceBalance('R001', 2024);

      expect(result).toEqual(savedCb);
      expect(mockComplianceRepository.saveComplianceBalance).toHaveBeenCalled();
    });
  });
});



