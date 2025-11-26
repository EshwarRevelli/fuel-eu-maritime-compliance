export interface Pool {
  id: string;
  year: number;
  createdAt: Date;
  members: PoolMember[];
}

export interface PoolMember {
  id: string;
  poolId: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface CreatePoolRequest {
  year: number;
  members: {
    shipId: string;
    cbBefore: number;
    cbAfter?: number; // Optional, will be calculated
  }[];
}

export interface CreatePoolResult {
  poolId: string;
  members: {
    shipId: string;
    cbBefore: number;
    cbAfter: number;
  }[];
}

