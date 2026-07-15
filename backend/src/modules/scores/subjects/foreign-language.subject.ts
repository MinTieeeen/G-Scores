/**
 * ForeignLanguageSubject - Ngoại Ngữ
 */

import { Subject } from './subject-base';
import { Score } from '../entities/score.entity';

export class ForeignLanguageSubject extends Subject {
  constructor() {
    super('ngoai_ngu', 'Ngoại Ngữ', 'ngoai_ngu');
  }

  hasScore(student: Score): boolean {
    return student.ngoai_ngu !== null;
  }
}
