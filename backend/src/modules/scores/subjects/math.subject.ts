/**
 * MathSubject - Toán
 */

import { Subject } from './subject-base';
import { Score } from '../entities/score.entity';

export class MathSubject extends Subject {
  constructor() {
    super('toan', 'Toán', 'toan');
  }

  /**
   * Kiểm tra học sinh có điểm Toán không
   */
  hasScore(student: Score): boolean {
    return student.toan !== null;
  }
}
