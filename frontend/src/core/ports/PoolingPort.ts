import { CreatePoolResult } from '../domain/Pooling';

export interface PoolingServicePort {
  createPool(year: number, members: Array<{ shipId: string; cbBefore: number }>): Promise<CreatePoolResult>;
}



