import { CreatePoolRequest, CreatePoolResult } from '../domain/Pooling';
import { PoolingServicePort, PoolingRepository } from '../ports/inbound/PoolingService';

export class PoolingUseCase implements PoolingServicePort {
  constructor(private poolingRepository: PoolingRepository) {}

  async createPool(request: CreatePoolRequest): Promise<CreatePoolResult> {
    // Validate: Sum of adjusted CB must be >= 0
    const totalCb = request.members.reduce((sum, m) => sum + m.cbBefore, 0);
    if (totalCb < 0) {
      throw new Error('Cannot create pool: Total Compliance Balance is negative');
    }

    // Greedy allocation: sort members by CB (descending)
    const sortedMembers = [...request.members].sort((a, b) => b.cbBefore - a.cbBefore);

    // Separate surplus and deficit ships
    const surplusShips = sortedMembers.filter(m => m.cbBefore > 0);
    const deficitShips = sortedMembers.filter(m => m.cbBefore < 0);

    // Allocate surplus to deficits
    const allocations = sortedMembers.map(m => ({
      shipId: m.shipId,
      cbBefore: m.cbBefore,
      cbAfter: m.cbBefore, // Start with same value
    }));

    let surplusIndex = 0;
    for (const deficit of deficitShips) {
      const deficitAmount = Math.abs(deficit.cbBefore);
      let remainingDeficit = deficitAmount;

      while (remainingDeficit > 0 && surplusIndex < surplusShips.length) {
        const surplus = surplusShips[surplusIndex];
        const deficitIndex = allocations.findIndex(a => a.shipId === deficit.shipId);
        const surplusAllocIndex = allocations.findIndex(a => a.shipId === surplus.shipId);

        if (allocations[surplusAllocIndex].cbAfter <= 0) {
          surplusIndex++;
          continue;
        }

        const availableSurplus = allocations[surplusAllocIndex].cbAfter;
        const transferAmount = Math.min(remainingDeficit, availableSurplus);

        allocations[deficitIndex].cbAfter += transferAmount;
        allocations[surplusAllocIndex].cbAfter -= transferAmount;

        remainingDeficit -= transferAmount;

        if (allocations[surplusAllocIndex].cbAfter <= 0) {
          surplusIndex++;
        }
      }
    }

    // Validate exit conditions
    for (const member of request.members) {
      const allocation = allocations.find(a => a.shipId === member.shipId);
      if (!allocation) continue;

      // Deficit ship cannot exit worse
      if (member.cbBefore < 0 && allocation.cbAfter < member.cbBefore) {
        throw new Error(`Deficit ship ${member.shipId} cannot exit worse than before`);
      }

      // Surplus ship cannot exit negative
      if (member.cbBefore > 0 && allocation.cbAfter < 0) {
        throw new Error(`Surplus ship ${member.shipId} cannot exit negative`);
      }
    }

    return this.poolingRepository.createPool({
      ...request,
      members: allocations,
    });
  }
}



