import { Controller, Get, Param } from '@nestjs/common';

@Controller('scores')
export class ScoresController {
  @Get(':sbd')
  findBySbd(@Param('sbd') sbd: string) {
    // TODO: Implement
    return { message: 'Coming soon...' };
  }
}
