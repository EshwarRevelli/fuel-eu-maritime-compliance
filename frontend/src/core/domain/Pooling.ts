export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface CreatePoolResult {
  poolId: string;
  members: PoolMember[];
}



