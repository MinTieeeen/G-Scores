/**
 * Subject Type Definitions
 * Định nghĩa các types cho OOP Subject pattern
 */

export type LevelType = 'excellent' | 'good' | 'pass' | 'fail';

export interface LevelCount {
  excellent: number;
  good: number;
  pass: number;
  fail: number;
}

export interface SubjectStatistics {
  total: number;
  levels: LevelCount;
}

export interface SubjectConfig {
  code: string;      // Mã môn: 'toan', 'vat_li'
  name: string;      // Tên tiếng Việt: 'Toán', 'Vật Lý'
  field: keyof Score; // Tên field trong entity
}

import { Score } from '../entities/score.entity';
