/**
 * PhysicsSubject - Vật Lý
 */

import { Subject } from './subject-base';
import { Score } from '../entities/score.entity';

export class PhysicsSubject extends Subject {
  constructor() {
    super('vat_li', 'Vật Lý', 'vat_li');
  }

  hasScore(student: Score): boolean {
    return student.vat_li !== null;
  }
}
