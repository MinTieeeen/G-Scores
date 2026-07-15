/**
 * Database Seeder
 * Import điểm thi từ CSV vào PostgreSQL
 *
 * Sử dụng: npm run seed
 */

import { DataSource } from 'typeorm';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import { Score } from '../modules/scores/entities/score.entity';

// Cấu hình database
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'gscores',
  synchronize: true, // Auto create tables
  logging: true,
});

// CSV file path
const CSV_PATH = path.join(__dirname, '../../../dataset/diem_thi_thpt_2024.csv');

// Batch size - insert nhiều dòng 1 lần để tăng tốc
const BATCH_SIZE = 1000;

interface CsvRow {
  sbd: string;
  toan: string;
  ngu_van: string;
  ngoai_ngu: string;
  vat_li: string;
  hoa_hoc: string;
  sinh_hoc: string;
  lich_su: string;
  dia_li: string;
  gdcd: string;
  ma_ngoai_ngu: string;
}

/**
 * Parse số từ string, trả về null nếu rỗng
 */
function parseScore(value: string): number | null {
  if (!value || value.trim() === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

/**
 * Main seeder function
 */
async function seed() {
  console.log('🚀 Bắt đầu seed dữ liệu điểm thi...\n');

  // 1. Kết nối database
  await AppDataSource.initialize();
  console.log('✅ Kết nối database thành công\n');

  // 2. Get repository
  const scoreRepository = AppDataSource.getRepository(Score);

  // 3. Đọc CSV
  console.log(`📖 Đang đọc file: ${CSV_PATH}`);
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  console.log(`📊 Tổng số dòng trong CSV: ${records.length.toLocaleString()}\n`);

  // 4. Clear existing data (optional - uncomment nếu muốn reset)
  // console.log('🗑️  Xóa dữ liệu cũ...');
  // await scoreRepository.delete({});
  // console.log('✅ Đã xóa dữ liệu cũ\n');

  // 5. Batch insert
  console.log('📝 Bắt đầu import...\n');
  const startTime = Date.now();
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);

    // Transform CSV rows to Score entities
    const scores = batch.map((row) => {
      const score = new Score();
      score.sbd = row.sbd;
      score.toan = parseScore(row.toan);
      score.ngu_van = parseScore(row.ngu_van);
      score.ngoai_ngu = parseScore(row.ngoai_ngu);
      score.vat_li = parseScore(row.vat_li);
      score.hoa_hoc = parseScore(row.hoa_hoc);
      score.sinh_hoc = parseScore(row.sinh_hoc);
      score.lich_su = parseScore(row.lich_su);
      score.dia_li = parseScore(row.dia_li);
      score.gdcd = parseScore(row.gdcd);
      score.ma_ngoai_ngu = row.ma_ngoai_ngu?.trim() || null;
      return score;
    });

    try {
      // Upsert - insert or update if exists
      await scoreRepository
        .createQueryBuilder()
        .insert()
        .into(Score)
        .values(scores)
        .orUpdate(['toan', 'ngu_van', 'ngoai_ngu', 'vat_li', 'hoa_hoc', 'sinh_hoc', 'lich_su', 'dia_li', 'gdcd', 'ma_ngoai_ngu'], ['sbd'])
        .execute();

      inserted += batch.length;

      // Progress logging
      const progress = ((i + batch.length) / records.length * 100).toFixed(1);
      process.stdout.write(`\r   Progress: ${progress}% (${inserted.toLocaleString()}/${records.length.toLocaleString()})`);
    } catch (error) {
      errors += batch.length;
      console.error(`\n❌ Lỗi ở batch ${i}-${i + batch.length}:`, error);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n\n');
  console.log('═══════════════════════════════════════');
  console.log('           📊 SEED RESULTS            ');
  console.log('═══════════════════════════════════════');
  console.log(`   ✅ Đã import: ${inserted.toLocaleString()} records`);
  console.log(`   ❌ Lỗi: ${errors.toLocaleString()} records`);
  console.log(`   ⏱️  Thời gian: ${elapsed}s`);
  console.log(`   🚀 Tốc độ: ${(inserted / parseFloat(elapsed)).toFixed(0)} records/s`);
  console.log('═══════════════════════════════════════\n');

  // 6. Verify
  const totalInDb = await scoreRepository.count();
  console.log(`📦 Tổng số records trong database: ${totalInDb.toLocaleString()}\n`);

  // 7. Close connection
  await AppDataSource.destroy();
  console.log('👋 Hoàn tất! Đóng kết nối database.');
}

// Run seeder
seed().catch((error) => {
  console.error('❌ Seeder thất bại:', error);
  process.exit(1);
});
