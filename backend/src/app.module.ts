import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScoresModule } from './modules/scores/scores.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { RankingsModule } from './modules/rankings/rankings.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'gscores',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),

    // Feature modules
    ScoresModule,
    StatisticsModule,
    RankingsModule,
  ],
})
export class AppModule {}
