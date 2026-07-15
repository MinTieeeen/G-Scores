/**
 * Statistics Service
 * Business logic cho thống kê điểm theo 4 mức
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../scores/entities/score.entity';
import { Subject, getAllSubjects, SUBJECTS, SubjectCode } from '../scores/subjects';

interface LevelCount {
  excellent: number;
  good: number;
  pass: number;
  fail: number;
}

interface SubjectStat {
  total: number;
  levels: LevelCount;
}

export interface StatisticsResponse {
  success: boolean;
  data: Record<string, SubjectStat>;
  meta: {
    queriedAt: string;
    ttl: number;
  };
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  /**
   * Lấy thống kê điểm cho tất cả các môn
   */
  async getStatistics(): Promise<StatisticsResponse> {
    const subjects = getAllSubjects();
    const result: Record<string, SubjectStat> = {};

    for (const subject of subjects) {
      result[subject.code] = await this.getSubjectStatistics(subject);
    }

    return {
      success: true,
      data: result,
      meta: {
        queriedAt: new Date().toISOString(),
        ttl: 300, // 5 minutes cache
      },
    };
  }

  /**
   * Lấy thống kê cho 1 môn cụ thể
   */
  async getSubjectStatistics(subject: Subject): Promise<SubjectStat> {
    const field = subject.field;

    // Raw SQL query để đếm theo các mức điểm
    const result = await this.scoreRepository
      .createQueryBuilder('score')
      .select(`COUNT(*) FILTER (WHERE "${field}" >= 8)`, 'excellent')
      .addSelect(`COUNT(*) FILTER (WHERE "${field}" >= 6 AND "${field}" < 8)`, 'good')
      .addSelect(`COUNT(*) FILTER (WHERE "${field}" >= 4 AND "${field}" < 6)`, 'pass')
      .addSelect(`COUNT(*) FILTER (WHERE "${field}" IS NOT NULL AND "${field}" < 4)`, 'fail')
      .addSelect(`COUNT(*) FILTER (WHERE "${field}" IS NOT NULL)`, 'total')
      .getRawOne();

    return {
      total: parseInt(result.total) || 0,
      levels: {
        excellent: parseInt(result.excellent) || 0,
        good: parseInt(result.good) || 0,
        pass: parseInt(result.pass) || 0,
        fail: parseInt(result.fail) || 0,
      },
    };
  }
}
