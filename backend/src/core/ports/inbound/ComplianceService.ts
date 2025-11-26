import { ComplianceBalance, AdjustedComplianceBalance } from '../../domain/Compliance';

export interface ComplianceRepository {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance | null>;
  saveComplianceBalance(cb: ComplianceBalance): Promise<ComplianceBalance>;
  getAdjustedComplianceBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance | null>;
}

export interface ComplianceServicePort {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedComplianceBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance>;
}



