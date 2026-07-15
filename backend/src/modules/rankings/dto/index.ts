/**
 * Rankings Response DTOs
 */

export class RankingItemDto {
  rank: number;
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  tong: number;
}

export interface RankingsResponse {
  success: boolean;
  data: RankingItemDto[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
