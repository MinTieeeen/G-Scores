/**
 * BiologySubject - Sinh Học
 */

import { Subject } from './subject-base';
import { Score } from '../entities/score.entity';

export class BiologySubject extends Subject {
  constructor() {
    super('sinh_hoc', 'Sinh Học', 'sinh_hoc');
  }

  hasScore(student: Score): boolean {
    return student.sinh_hoc !== null;
  }
}
