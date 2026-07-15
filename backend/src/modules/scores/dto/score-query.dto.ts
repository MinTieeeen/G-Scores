/**
 * Score Query DTO
 * Validation cho request tra cứu điểm
 */

import { IsString, Length, Matches } from 'class-validator';

export class ScoreQueryDto {
  @IsString({ message: 'SBD phải là chuỗi ký tự' })
  @Length(8, 8, { message: 'SBD phải có đúng 8 chữ số' })
  @Matches(/^\d{8}$/, { message: 'SBD chỉ được chứa số (0-9)' })
  sbd: string;
}
