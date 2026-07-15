import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { Score } from '../scores/entities/score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Score])],
  controllers: [RankingsController],
  providers: [RankingsService],
  exports: [RankingsService],
})
export class RankingsModule {}
