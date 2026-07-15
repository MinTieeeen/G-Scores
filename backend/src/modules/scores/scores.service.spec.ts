/**
 * Scores Service Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { Score } from './entities/score.entity';

describe('ScoresService', () => {
  let service: ScoresService;
  let repository: Repository<Score>;

  const mockScore: Score = {
    sbd: '01000001',
    toan: 8.4,
    ngu_van: 6.75,
    ngoai_ngu: 8.0,
    vat_li: 6.0,
    hoa_hoc: 5.25,
    sinh_hoc: 5.0,
    lich_su: null,
    dia_li: null,
    gdcd: null,
    ma_ngoai_ngu: 'N1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoresService,
        {
          provide: getRepositoryToken(Score),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ScoresService>(ScoresService);
    repository = module.get<Repository<Score>>(getRepositoryToken(Score));

    jest.clearAllMocks();
  });

  describe('findBySbd', () => {
    it('should return score when SBD exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockScore);

      const result = await service.findBySbd('01000001');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.sbd).toBe('01000001');
      expect(result.data?.toan).toBe(8.4);
      expect(result.meta?.queriedAt).toBeDefined();
    });

    it('should throw NotFoundException when SBD does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findBySbd('99999999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should call repository with correct parameters', async () => {
      mockRepository.findOne.mockResolvedValue(mockScore);

      await service.findBySbd('01000001');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { sbd: '01000001' },
      });
    });

    it('should return all subjects with null for missing scores', async () => {
      const partialScore = { ...mockScore, vat_li: null, hoa_hoc: null };
      mockRepository.findOne.mockResolvedValue(partialScore);

      const result = await service.findBySbd('01000001');

      expect(result.data?.vat_li).toBeNull();
      expect(result.data?.hoa_hoc).toBeNull();
    });
  });

  describe('getTotalCount', () => {
    it('should return total count of students', async () => {
      mockRepository.count.mockResolvedValue(1000000);

      const result = await service.getTotalCount();

      expect(result).toBe(1000000);
      expect(mockRepository.count).toHaveBeenCalled();
    });
  });
});
