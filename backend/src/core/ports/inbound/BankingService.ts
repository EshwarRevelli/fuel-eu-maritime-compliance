import { BankEntry, BankingOperation, BankingResult } from '../../domain/Banking';

export interface BankingRepository {
  getBankedAmount(shipId: string, year: number): Promise<number>;
  createBankEntry(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry>;
  getAllBankEntries(shipId: string, year: number): Promise<BankEntry[]>;
}

export interface BankingServicePort {
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(operation: BankingOperation): Promise<BankEntry>;
  applyBanked(operation: BankingOperation): Promise<BankingResult>;
}



