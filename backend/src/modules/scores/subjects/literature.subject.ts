/**
 * LiteratureSubject - Ngữ Văn
 */

import { Subject } from './subject-base';
import { Score } from '../entities/score.entity';

export class LiteratureSubject extends Subject {
  constructor() {
    super('ngu_van', 'Ngữ Văn', 'ngu_van');
  }

  hasScore(student: Score): boolean {
    return student.ngu_van !== null;
  }
}
