/**
 * ChemistrySubject - Hóa Học
 */

import { Subject } from './subject-base';
import { Score } from '../entities/score.entity';

export class ChemistrySubject extends Subject {
  constructor() {
    super('hoa_hoc', 'Hóa Học', 'hoa_hoc');
  }

  hasScore(student: Score): boolean {
    return student.hoa_hoc !== null;
  }
}
