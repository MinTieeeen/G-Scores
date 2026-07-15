/**
 * Statistics Controller
 * HTTP handlers cho thống kê điểm
 */

import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  /**
   * GET /api/statistics
   * Lấy thống kê điểm theo 4 mức cho tất cả các môn
   */
  @Get()
  async getStatistics() {
    return this.statisticsService.getStatistics();
  }
}
