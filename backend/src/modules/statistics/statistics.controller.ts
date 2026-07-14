import { Controller, Get } from '@nestjs/common';

@Controller('statistics')
export class StatisticsController {
  @Get()
  getStatistics() {
    // TODO: Implement
    return { message: 'Coming soon...' };
  }
}
