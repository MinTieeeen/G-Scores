/**
 * GeographySubject - Địa Lý
 */

import { Subject } from './subject-base';
import { Score } from '../entities/score.entity';

export class GeographySubject extends Subject {
  constructor() {
    super('dia_li', 'Địa Lý', 'dia_li');
  }

  hasScore(student: Score): boolean {
    return student.dia_li !== null;
  }
}
