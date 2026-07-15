/**
 * Rankings Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankingsService } from './rankings.service';
import { Score } from '../scores/entities/score.entity';

describe('RankingsService', () => {
  let service: RankingsService;
  let repository: Repository<Score>;

  const mockTopRankings = [
    { sbd: '01000008', toan: '8.2', vat_li: '8.0', hoa_hoc: '10.0', tong: '26.2' },
    { sbd: '01000012', toan: '8.2', vat_li: '7.75', hoa_hoc: '6.25', tong: '22.2' },
    { sbd: '01000015', toan: '7.6', vat_li: '7.75', hoa_hoc: '8.75', tong: '24.1' },
  ];

  const mockRepository = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(1000),
      getRawMany: jest.fn().mockResolvedValue(mockTopRankings),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingsService,
        {
          provide: getRepositoryToken(Score),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RankingsService>(RankingsService);
    repository = module.get<Repository<Score>>(getRepositoryToken(Score));

    jest.clearAllMocks();
  });

  describe('getTopRankings', () => {
    it('should return top rankings with correct structure', async () => {
      const result = await service.getTopRankings({ limit: 10, offset: 0 });

      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBe(3);
      expect(result.meta.total).toBe(1000);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.offset).toBe(0);
    });

    it('should calculate correct rank numbers', async () => {
      const result = await service.getTopRankings({ limit: 10, offset: 0 });

      expect(result.data[0].rank).toBe(1);
      expect(result.data[1].rank).toBe(2);
      expect(result.data[2].rank).toBe(3);
    });

    it('should offset rank when offset is provided', async () => {
      const result = await service.getTopRankings({ limit: 10, offset: 10 });

      expect(result.data[0].rank).toBe(11);
      expect(result.data[1].rank).toBe(12);
    });

    it('should parse scores as numbers', async () => {
      const result = await service.getTopRankings({ limit: 10, offset: 0 });

      expect(typeof result.data[0].toan).toBe('number');
      expect(result.data[0].toan).toBe(8.2);
    });

    it('should calculate total correctly', async () => {
      const result = await service.getTopRankings({ limit: 10, offset: 0 });

      expect(result.data[0].tong).toBe(26.2); // 8.2 + 8.0 + 10.0
    });
  });
});
