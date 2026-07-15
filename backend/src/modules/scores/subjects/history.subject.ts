/**
 * HistorySubject - Lịch Sử
 */

import { Subject } from './subject-base';
import { Score } from '../entities/score.entity';

export class HistorySubject extends Subject {
  constructor() {
    super('lich_su', 'Lịch Sử', 'lich_su');
  }

  hasScore(student: Score): boolean {
    return student.lich_su !== null;
  }
}
