import { BankingServicePort } from '../../../core/ports/BankingPort';
import { BankEntry, BankingResult } from '../../../core/domain/Banking';
import { ApiClient } from '../../infrastructure/ApiClient';

export class BankingService implements BankingServicePort {
  constructor(private apiClient: ApiClient) {}

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return this.apiClient.getBankRecords(shipId, year);
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    return this.apiClient.bankSurplus(shipId, year, amount);
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult> {
    return this.apiClient.applyBanked(shipId, year, amount);
  }
}



