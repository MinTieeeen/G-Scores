/**
 * Subject Base Class
 * Abstract class định nghĩa interface chung cho các môn học
 */

import { Score } from '../entities/score.entity';
import { LevelType, SubjectStatistics, LevelCount } from './subject.types';

export abstract class Subject {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly field: keyof Score,
  ) {}

  /**
   * Lấy điểm của học sinh cho môn này
   */
  getScore(student: Score): number | null {
    const value = student[this.field];
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    // Handle string from DB (TypeORM decimal returns string)
    const num = parseFloat(String(value));
    return isNaN(num) ? null : num;
  }

  /**
   * Phân loại điểm vào 4 mức
   * - excellent: >= 8.0
   * - good: >= 6.0 && < 8.0
   * - pass: >= 4.0 && < 6.0
   * - fail: < 4.0
   */
  getLevel(score: number): LevelType {
    if (score >= 8) return 'excellent';
    if (score >= 6) return 'good';
    if (score >= 4) return 'pass';
    return 'fail';
  }

  /**
   * Đếm số học sinh mỗi mức điểm
   */
  calculateStatistics(scores: (number | null)[]): SubjectStatistics {
    const validScores = scores.filter((s): s is number => s !== null);

    const levels: LevelCount = {
      excellent: 0,
      good: 0,
      pass: 0,
      fail: 0,
    };

    for (const score of validScores) {
      const level = this.getLevel(score);
      levels[level]++;
    }

    return {
      total: validScores.length,
      levels,
    };
  }

  /**
   * So sánh 2 điểm - dùng cho sorting
   */
  compareScore(a: number, b: number): number {
    return b - a; // Descending order
  }
}
