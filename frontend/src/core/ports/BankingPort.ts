import { BankEntry, BankingResult } from '../domain/Banking';

export interface BankingServicePort {
  getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry>;
  applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult>;
}



