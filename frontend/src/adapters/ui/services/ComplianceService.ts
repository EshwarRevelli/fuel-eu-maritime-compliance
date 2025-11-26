import { ComplianceServicePort } from '../../../core/ports/CompliancePort';
import { ComplianceBalance, AdjustedComplianceBalance } from '../../../core/domain/Compliance';
import { ApiClient } from '../../infrastructure/ApiClient';

export class ComplianceService implements ComplianceServicePort {
  constructor(private apiClient: ApiClient) {}

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    return this.apiClient.getComplianceBalance(shipId, year);
  }

  async getAdjustedComplianceBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance> {
    return this.apiClient.getAdjustedComplianceBalance(shipId, year);
  }
}



