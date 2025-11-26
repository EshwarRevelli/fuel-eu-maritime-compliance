import { ComplianceBalance, AdjustedComplianceBalance } from '../domain/Compliance';

export interface ComplianceServicePort {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedComplianceBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance>;
}



