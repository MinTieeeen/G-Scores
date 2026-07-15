/**
 * Subject Base Class Tests
 */

import { Subject } from './subject-base';
import { Score } from '../entities/score.entity';

// Concrete implementation for testing
class TestSubject extends Subject {
  constructor() {
    super('test', 'Test Subject', 'toan');
  }
}

describe('Subject Base Class', () => {
  let subject: TestSubject;

  beforeEach(() => {
    subject = new TestSubject();
  });

  describe('getLevel', () => {
    it('should return excellent for score >= 8', () => {
      expect(subject.getLevel(8)).toBe('excellent');
      expect(subject.getLevel(9)).toBe('excellent');
      expect(subject.getLevel(10)).toBe('excellent');
    });

    it('should return good for score >= 6 and < 8', () => {
      expect(subject.getLevel(6)).toBe('good');
      expect(subject.getLevel(6.5)).toBe('good');
      expect(subject.getLevel(7.9)).toBe('good');
    });

    it('should return pass for score >= 4 and < 6', () => {
      expect(subject.getLevel(4)).toBe('pass');
      expect(subject.getLevel(5)).toBe('pass');
      expect(subject.getLevel(5.9)).toBe('pass');
    });

    it('should return fail for score < 4', () => {
      expect(subject.getLevel(0)).toBe('fail');
      expect(subject.getLevel(3.9)).toBe('fail');
      expect(subject.getLevel(1)).toBe('fail');
    });
  });

  describe('calculateStatistics', () => {
    it('should calculate statistics correctly', () => {
      const scores: (number | null)[] = [9, 7, 5, 3, 8, 6, 4, 2, 10, 1];
      const result = subject.calculateStatistics(scores);

      expect(result.total).toBe(10);
      expect(result.levels.excellent).toBe(3); // 9, 8, 10
      expect(result.levels.good).toBe(2);       // 7, 6
      expect(result.levels.pass).toBe(2);       // 5, 4
      expect(result.levels.fail).toBe(3);        // 3, 2, 1
    });

    it('should handle null values', () => {
      const scores: (number | null)[] = [8, null, 5, null, 6];
      const result = subject.calculateStatistics(scores);

      expect(result.total).toBe(3);
      expect(result.levels.excellent).toBe(1);
      expect(result.levels.good).toBe(1);
      expect(result.levels.pass).toBe(1);
    });

    it('should handle empty array', () => {
      const scores: (number | null)[] = [];
      const result = subject.calculateStatistics(scores);

      expect(result.total).toBe(0);
      expect(result.levels.excellent).toBe(0);
      expect(result.levels.good).toBe(0);
      expect(result.levels.pass).toBe(0);
      expect(result.levels.fail).toBe(0);
    });
  });

  describe('getScore', () => {
    it('should return score when field is not null', () => {
      const student = { toan: 8.5 } as unknown as Score;
      expect(subject.getScore(student)).toBe(8.5);
    });

    it('should return null when field is null', () => {
      const student = { toan: null } as unknown as Score;
      expect(subject.getScore(student)).toBeNull();
    });

    it('should handle string value from database', () => {
      const student = { toan: '7.5' } as unknown as Score;
      expect(subject.getScore(student)).toBe(7.5);
    });
  });
});
