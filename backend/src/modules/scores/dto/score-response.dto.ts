/**
 * Score Response DTO
 * Standard API response format
 */

export class ScoreResponseDto {
  success: boolean;
  data: ScoreData | null;
  meta?: {
    queriedAt: string;
  };
  error?: string;
}

export interface ScoreData {
  sbd: string;
  toan: number | null;
  ngu_van: number | null;
  ngoai_ngu: number | null;
  vat_li: number | null;
  hoa_hoc: number | null;
  sinh_hoc: number | null;
  lich_su: number | null;
  dia_li: number | null;
  gdcd: number | null;
  ma_ngoai_ngu: string | null;
}
