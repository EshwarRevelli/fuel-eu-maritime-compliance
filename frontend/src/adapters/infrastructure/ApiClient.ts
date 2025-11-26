import axios from 'axios';
import { Route, RouteComparison } from '../../core/domain/Route';
import { ComplianceBalance, AdjustedComplianceBalance } from '../../core/domain/Compliance';
import { BankEntry, BankingResult } from '../../core/domain/Banking';
import { CreatePoolResult } from '../../core/domain/Pooling';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiClient {
  // Routes
  async getAllRoutes(): Promise<Route[]> {
    const response = await api.get<Route[]>('/routes');
    return response.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const response = await api.post<Route>(`/routes/${routeId}/baseline`);
    return response.data;
  }

  async getComparison(): Promise<RouteComparison[]> {
    const response = await api.get<RouteComparison[]>('/routes/comparison');
    return response.data;
  }

  // Compliance
  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await api.get<ComplianceBalance>('/compliance/cb', {
      params: { shipId, year },
    });
    return response.data;
  }

  async getAdjustedComplianceBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance> {
    const response = await api.get<AdjustedComplianceBalance>('/compliance/adjusted-cb', {
      params: { shipId, year },
    });
    return response.data;
  }

  // Banking
  async getBankRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const response = await api.get<BankEntry[]>('/banking/records', {
      params: { shipId, year },
    });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const response = await api.post<BankEntry>('/banking/bank', {
      shipId,
      year,
      amount,
    });
    return response.data;
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult> {
    const response = await api.post<BankingResult>('/banking/apply', {
      shipId,
      year,
      amount,
    });
    return response.data;
  }

  // Pooling
  async createPool(year: number, members: Array<{ shipId: string; cbBefore: number }>): Promise<CreatePoolResult> {
    const response = await api.post<CreatePoolResult>('/pools', {
      year,
      members,
    });
    return response.data;
  }
}



