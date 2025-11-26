import { PoolingServicePort } from '../../../core/ports/PoolingPort';
import { CreatePoolResult } from '../../../core/domain/Pooling';
import { ApiClient } from '../../infrastructure/ApiClient';

export class PoolingService implements PoolingServicePort {
  constructor(private apiClient: ApiClient) {}

  async createPool(year: number, members: Array<{ shipId: string; cbBefore: number }>): Promise<CreatePoolResult> {
    return this.apiClient.createPool(year, members);
  }
}



