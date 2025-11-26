import { BankEntry, BankingOperation, BankingResult } from '../domain/Banking';
import { BankingServicePort, BankingRepository } from '../ports/inbound/BankingService';
import { ComplianceServicePort, ComplianceRepository } from '../ports/inbound/ComplianceService';

export class BankingUseCase implements BankingServicePort {
  constructor(
    private bankingRepository: BankingRepository,
    private complianceService: ComplianceServicePort,
    private complianceRepository: ComplianceRepository
  ) {}

  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return this.bankingRepository.getAllBankEntries(shipId, year);
  }

  async bankSurplus(operation: BankingOperation): Promise<BankEntry> {
    const cb = await this.complianceService.getComplianceBalance(operation.shipId, operation.year);

    if (cb.cbGco2eq <= 0) {
      throw new Error('Cannot bank: Compliance Balance is not positive');
    }

    if (operation.amount > cb.cbGco2eq) {
      throw new Error('Cannot bank: Amount exceeds available surplus');
    }

    return this.bankingRepository.createBankEntry({
      shipId: operation.shipId,
      year: operation.year,
      amountGco2eq: operation.amount,
    });
  }

  async applyBanked(operation: BankingOperation): Promise<BankingResult> {
    const cbBefore = await this.complianceService.getComplianceBalance(
      operation.shipId,
      operation.year
    );

    const bankedAmount = await this.bankingRepository.getBankedAmount(
      operation.shipId,
      operation.year
    );

    if (operation.amount > bankedAmount) {
      throw new Error('Cannot apply: Amount exceeds available banked surplus');
    }

    const cbAfter = cbBefore.cbGco2eq + operation.amount;

    // Update the compliance balance in the database
    await this.complianceRepository.saveComplianceBalance({
      shipId: operation.shipId,
      year: operation.year,
      cbGco2eq: cbAfter,
    });

    return {
      cbBefore: cbBefore.cbGco2eq,
      applied: operation.amount,
      cbAfter,
    };
  }
}

