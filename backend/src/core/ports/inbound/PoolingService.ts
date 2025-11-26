import { CreatePoolRequest, CreatePoolResult } from '../../domain/Pooling';

export interface PoolingRepository {
  createPool(request: CreatePoolRequest): Promise<CreatePoolResult>;
}

export interface PoolingServicePort {
  createPool(request: CreatePoolRequest): Promise<CreatePoolResult>;
}



