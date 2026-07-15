/**
 * Rankings Service
 * Business logic cho Top N học sinh nhóm A (KHTN)
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../scores/entities/score.entity';
import { RankingsQueryDto } from './dto/ranking-query.dto';
import { RankingsResponse, RankingItemDto } from './dto';

@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  /**
   * Lấy Top N học sinh nhóm A (KHTN)
   * Nhóm A = Toán + Vật Lý + Hóa Học
   *
   * Rules:
   * - Chỉ HS có đủ 3 môn (NOT NULL)
   * - Tie-breaker: SBD nhỏ hơn xếp trên
   */
  async getTopRankings(query: RankingsQueryDto): Promise<RankingsResponse> {
    const { limit, offset } = query;

    // Query lấy tổng số HS đủ điều kiện
    const totalResult = await this.scoreRepository
      .createQueryBuilder('score')
      .where('score.toan IS NOT NULL')
      .andWhere('score.vat_li IS NOT NULL')
      .andWhere('score.hoa_hoc IS NOT NULL')
      .getCount();

    // Query lấy Top N với tính tổng điểm
    const rankings = await this.scoreRepository
      .createQueryBuilder('score')
      .select('score.sbd', 'sbd')
      .addSelect('score.toan', 'toan')
      .addSelect('score.vat_li', 'vat_li')
      .addSelect('score.hoa_hoc', 'hoa_hoc')
      .addSelect(
        '(score.toan + score.vat_li + score.hoa_hoc)',
        'tong',
      )
      .where('score.toan IS NOT NULL')
      .andWhere('score.vat_li IS NOT NULL')
      .andWhere('score.hoa_hoc IS NOT NULL')
      .orderBy('tong', 'DESC')
      .addOrderBy('score.sbd', 'ASC') // Tie-breaker: SBD nhỏ hơn
      .offset(offset)
      .limit(limit)
      .getRawMany();

    // Thêm rank dựa trên vị trí
    const data: RankingItemDto[] = rankings.map((item, index) => ({
      rank: offset + index + 1,
      sbd: item.sbd,
      toan: parseFloat(item.toan),
      vat_li: parseFloat(item.vat_li),
      hoa_hoc: parseFloat(item.hoa_hoc),
      tong: parseFloat(item.tong),
    }));

    return {
      success: true,
      data,
      meta: {
        total: totalResult,
        limit,
        offset,
      },
    };
  }
}
