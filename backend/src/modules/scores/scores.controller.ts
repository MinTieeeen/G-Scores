/**
 * Scores Controller
 * HTTP handlers cho tra cứu điểm
 */

import { Controller, Get, Param } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoreQueryDto } from './dto/score-query.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  /**
   * GET /api/scores/:sbd
   * Tra cứu điểm theo SBD
   */
  @Get(':sbd')
  async findBySbd(@Param() params: ScoreQueryDto) {
    return this.scoresService.findBySbd(params.sbd);
  }
}
