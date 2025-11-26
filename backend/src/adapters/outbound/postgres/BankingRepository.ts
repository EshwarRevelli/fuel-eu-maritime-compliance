import { PrismaClient } from '@prisma/client';
import { BankEntry } from '../../../core/domain/Banking';
import { BankingRepository as IBankingRepository } from '../../../core/ports/inbound/BankingService';

export class PrismaBankingRepository implements IBankingRepository {
  constructor(private prisma: PrismaClient) {}

  async getBankedAmount(shipId: string, year: number): Promise<number> {
    const entries = await this.prisma.bankEntry.findMany({
      where: { shipId, year },
    });

    return entries.reduce((sum, entry) => sum + entry.amountGco2eq, 0);
  }

  async createBankEntry(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry> {
    const created = await this.prisma.bankEntry.create({
      data: {
        shipId: entry.shipId,
        year: entry.year,
        amountGco2eq: entry.amountGco2eq,
      },
    });

    return {
      id: created.id,
      shipId: created.shipId,
      year: created.year,
      amountGco2eq: created.amountGco2eq,
      createdAt: created.createdAt,
    };
  }

  async getAllBankEntries(shipId: string, year: number): Promise<BankEntry[]> {
    const entries = await this.prisma.bankEntry.findMany({
      where: { shipId, year },
      orderBy: { createdAt: 'desc' },
    });

    return entries.map(e => ({
      id: e.id,
      shipId: e.shipId,
      year: e.year,
      amountGco2eq: e.amountGco2eq,
      createdAt: e.createdAt,
    }));
  }
}



