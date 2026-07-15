/**
 * Scores Service
 * Business logic cho tra cứu điểm thi
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { ScoreResponseDto, ScoreData } from './dto/score-response.dto';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  /**
   * Tra cứu điểm theo SBD
   * @param sbd - Số báo danh (8 chữ số)
   */
  async findBySbd(sbd: string): Promise<ScoreResponseDto> {
    const score = await this.scoreRepository.findOne({
      where: { sbd },
    });

    if (!score) {
      throw new NotFoundException({
        success: false,
        error: `Không tìm thấy thí sinh với SBD: ${sbd}`,
      });
    }

    const data: ScoreData = {
      sbd: score.sbd,
      toan: score.toan,
      ngu_van: score.ngu_van,
      ngoai_ngu: score.ngoai_ngu,
      vat_li: score.vat_li,
      hoa_hoc: score.hoa_hoc,
      sinh_hoc: score.sinh_hoc,
      lich_su: score.lich_su,
      dia_li: score.dia_li,
      gdcd: score.gdcd,
      ma_ngoai_ngu: score.ma_ngoai_ngu,
    };

    return {
      success: true,
      data,
      meta: {
        queriedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Lấy tổng số thí sinh trong database
   */
  async getTotalCount(): Promise<number> {
    return this.scoreRepository.count();
  }
}
