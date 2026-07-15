/**
 * CivicEducationSubject - GDCD
 */

import { Subject } from './subject-base';
import { Score } from '../entities/score.entity';

export class CivicEducationSubject extends Subject {
  constructor() {
    super('gdcd', 'GDCD', 'gdcd');
  }

  hasScore(student: Score): boolean {
    return student.gdcd !== null;
  }
}
