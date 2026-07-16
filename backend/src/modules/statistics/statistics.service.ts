/**
 * Statistics Service
 * Business logic cho thống kê điểm theo môn
 * Trả về format đúng với frontend: so_luong, trung_binh, diem_cao_nhat, diem_thap_nhat
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../scores/entities/score.entity';
import { getAllSubjects } from '../scores/subjects';

interface SubjectStat {
  so_luong: number;
  trung_binh: number;
  diem_cao_nhat: number;
  diem_thap_nhat: number;
  do_lech_chuan: number;
}

export interface StatisticsResponseData {
  toan?: SubjectStat;
  ngu_van?: SubjectStat;
  ngoai_ngu?: SubjectStat;
  vat_li?: SubjectStat;
  hoa_hoc?: SubjectStat;
  sinh_hoc?: SubjectStat;
  lich_su?: SubjectStat;
  dia_li?: SubjectStat;
  gdcd?: SubjectStat;
  tong_so_bai_thi: number;
}

export interface StatisticsResponse {
  success: boolean;
  data: StatisticsResponseData;
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

    // Tính tổng số bài thi (distinct SBD)
    const totalRow = await this.scoreRepository
      .createQueryBuilder('score')
      .select('COUNT(*)', 'total')
      .getRawOne();
    const tongSoBaiThi = parseInt(totalRow?.total ?? '0') || 0;

    for (const subject of subjects) {
      result[subject.code] = await this.getSubjectStatistics(subject.field);
    }

    return {
      success: true,
      data: {
        ...result,
        tong_so_bai_thi: tongSoBaiThi,
      } as StatisticsResponseData,
      meta: {
        queriedAt: new Date().toISOString(),
        ttl: 300,
      },
    };
  }

  /**
   * Lấy thống kê cho 1 môn cụ thể — dùng raw SQL aggregate
   */
  private async getSubjectStatistics(field: string): Promise<SubjectStat> {
    const result = await this.scoreRepository
      .createQueryBuilder('score')
      .select(`COUNT("${field}")`, 'so_luong')
      .addSelect(`AVG("${field}")`, 'trung_binh')
      .addSelect(`MAX("${field}")`, 'diem_cao_nhat')
      .addSelect(`MIN("${field}")`, 'diem_thap_nhat')
      .addSelect(`STDDEV("${field}")`, 'do_lech_chuan')
      .where(`"${field}" IS NOT NULL`)
      .getRawOne();

    return {
      so_luong: parseInt(result?.so_luong ?? '0') || 0,
      trung_binh: parseFloat(result?.trung_binh ?? '0') || 0,
      diem_cao_nhat: parseFloat(result?.diem_cao_nhat ?? '0') || 0,
      diem_thap_nhat: parseFloat(result?.diem_thap_nhat ?? '0') || 0,
      do_lech_chuan: parseFloat(result?.do_lech_chuan ?? '0') || 0,
    };
  }
}
