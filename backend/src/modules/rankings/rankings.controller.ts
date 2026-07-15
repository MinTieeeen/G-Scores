/**
 * Rankings Controller
 * HTTP handlers cho xếp hạng
 */

import { Controller, Get, Query } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { RankingsQueryDto } from './dto/ranking-query.dto';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  /**
   * GET /api/rankings?limit=10&offset=0
   * Lấy Top N học sinh nhóm A
   */
  @Get()
  async getTopRankings(@Query() query: RankingsQueryDto) {
    return this.rankingsService.getTopRankings(query);
  }
}
