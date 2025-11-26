import { PrismaClient } from '@prisma/client';
import { CreatePoolRequest, CreatePoolResult } from '../../../core/domain/Pooling';
import { PoolingRepository as IPoolingRepository } from '../../../core/ports/inbound/PoolingService';

export class PrismaPoolingRepository implements IPoolingRepository {
  constructor(private prisma: PrismaClient) {}

  async createPool(request: CreatePoolRequest & { members: Array<{ shipId: string; cbBefore: number; cbAfter: number }> }): Promise<CreatePoolResult> {
    const pool = await this.prisma.pool.create({
      data: {
        year: request.year,
        members: {
          create: request.members.map(m => ({
            shipId: m.shipId,
            cbBefore: m.cbBefore,
            cbAfter: m.cbAfter,
          })),
        },
      },
      include: { members: true },
    });

    return {
      poolId: pool.id,
      members: pool.members.map(m => ({
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })),
    };
  }
}

