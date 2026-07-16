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

    // Database configuration - support both DATABASE_URL and individual vars
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.DATABASE_URL ? true : false, // Enable SSL for Neon
    }),

    // Feature modules
    ScoresModule,
    StatisticsModule,
    RankingsModule,
  ],
})
export class AppModule {}
