import { PoolingUseCase } from '../PoolingUseCase';
import { PoolingRepository } from '../../ports/inbound/PoolingService';
import { CreatePoolRequest } from '../../domain/Pooling';

describe('PoolingUseCase', () => {
  let poolingUseCase: PoolingUseCase;
  let mockPoolingRepository: jest.Mocked<PoolingRepository>;

  beforeEach(() => {
    mockPoolingRepository = {
      createPool: jest.fn(),
    };

    poolingUseCase = new PoolingUseCase(mockPoolingRepository);
  });

  it('should reject pool with negative total CB', async () => {
    const request: CreatePoolRequest = {
      year: 2024,
      members: [
        { shipId: 'R001', cbBefore: -1000 },
        { shipId: 'R002', cbBefore: -500 },
      ],
    };

    await expect(poolingUseCase.createPool(request)).rejects.toThrow(
      'Cannot create pool: Total Compliance Balance is negative'
    );
  });

  it('should create valid pool with surplus and deficit', async () => {
    const request: CreatePoolRequest = {
      year: 2024,
      members: [
        { shipId: 'R001', cbBefore: 1000 },
        { shipId: 'R002', cbBefore: -500 },
      ],
    };

    const expectedResult = {
      poolId: 'pool-1',
      members: [
        { shipId: 'R001', cbBefore: 1000, cbAfter: 500 },
        { shipId: 'R002', cbBefore: -500, cbAfter: 0 },
      ],
    };

    mockPoolingRepository.createPool.mockResolvedValue(expectedResult);

    const result = await poolingUseCase.createPool(request);

    expect(result).toEqual(expectedResult);
    expect(mockPoolingRepository.createPool).toHaveBeenCalled();
  });
});



