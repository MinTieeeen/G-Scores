/**
 * Score Query DTO Validation Tests
 */

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ScoreQueryDto } from './score-query.dto';

describe('ScoreQueryDto Validation', () => {
  const validateDto = async (dto: ScoreQueryDto): Promise<string[]> => {
    const errors = await validate(dto);
    return errors.map((e) => Object.values(e.constraints || {}).join(', '));
  };

  describe('SBD validation', () => {
    it('should pass with valid 8-digit SBD', async () => {
      const dto = plainToInstance(ScoreQueryDto, { sbd: '01000001' });
      const errors = await validateDto(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with all digits SBD', async () => {
      const dto = plainToInstance(ScoreQueryDto, { sbd: '12345678' });
      const errors = await validateDto(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with less than 8 digits', async () => {
      const dto = plainToInstance(ScoreQueryDto, { sbd: '1234567' });
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('8 chữ số');
    });

    it('should fail with more than 8 digits', async () => {
      const dto = plainToInstance(ScoreQueryDto, { sbd: '123456789' });
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail with non-numeric characters', async () => {
      const dto = plainToInstance(ScoreQueryDto, { sbd: '1234567a' });
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('chỉ được chứa số');
    });

    it('should fail with empty string', async () => {
      const dto = plainToInstance(ScoreQueryDto, { sbd: '' });
      const errors = await validateDto(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
