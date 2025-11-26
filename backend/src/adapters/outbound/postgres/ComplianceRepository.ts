import { PrismaClient } from '@prisma/client';
import { ComplianceBalance, AdjustedComplianceBalance } from '../../../core/domain/Compliance';
import { ComplianceRepository as IComplianceRepository } from '../../../core/ports/inbound/ComplianceService';
import { BankingRepository } from '../../../core/ports/inbound/BankingService';

export class PrismaComplianceRepository implements IComplianceRepository {
  constructor(
    private prisma: PrismaClient,
    private bankingRepository: BankingRepository
  ) {}

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const cb = await this.prisma.shipCompliance.findUnique({
      where: { shipId_year: { shipId, year } },
    });

    if (!cb) return null;

    return {
      shipId: cb.shipId,
      year: cb.year,
      cbGco2eq: cb.cbGco2eq,
    };
  }

  async saveComplianceBalance(cb: ComplianceBalance): Promise<ComplianceBalance> {
    const saved = await this.prisma.shipCompliance.upsert({
      where: { shipId_year: { shipId: cb.shipId, year: cb.year } },
      update: { cbGco2eq: cb.cbGco2eq },
      create: {
        shipId: cb.shipId,
        year: cb.year,
        cbGco2eq: cb.cbGco2eq,
      },
    });

    return {
      shipId: saved.shipId,
      year: saved.year,
      cbGco2eq: saved.cbGco2eq,
    };
  }

  async getAdjustedComplianceBalance(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance | null> {
    const baseCb = await this.getComplianceBalance(shipId, year);
    if (!baseCb) return null;

    // Get applied banked amount (negative means applied)
    const bankedAmount = await this.bankingRepository.getBankedAmount(shipId, year);
    
    // For simplicity, we'll calculate adjusted as base + banked
    // In a real system, we'd track applied amounts separately
    const adjustedCbGco2eq = baseCb.cbGco2eq; // This would be adjusted by banking applications

    return {
      ...baseCb,
      adjustedCbGco2eq,
    };
  }
}



