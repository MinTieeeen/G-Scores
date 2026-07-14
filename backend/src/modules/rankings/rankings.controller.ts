import { Controller, Get } from '@nestjs/common';

@Controller('rankings')
export class RankingsController {
  @Get('top-10')
  getTop10GroupA() {
    // TODO: Implement
    return { message: 'Coming soon...' };
  }
}
