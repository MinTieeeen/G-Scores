/**
 * TypeScript Types cho G-Scores Frontend
 */

// ==================== SCORE TYPES ====================

export interface Score {
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

export interface ScoreResponse {
  success: boolean;
  data: Score;
}

export interface ScoreQuery {
  sbd: string;
}

// ==================== STATISTICS TYPES ====================

export interface SubjectStats {
  so_luong: number;
  trung_binh: number;
  diem_cao_nhat: number;
  diem_thap_nhat: number;
  do_lech_chuan: number;
}

export interface StatisticsResponse {
  success: boolean;
  data: {
    toan: SubjectStats;
    ngu_van: SubjectStats;
    ngoai_ngu: SubjectStats;
    vat_li: SubjectStats;
    hoa_hoc: SubjectStats;
    sinh_hoc: SubjectStats;
    lich_su: SubjectStats;
    dia_li: SubjectStats;
    gdcd: SubjectStats;
    tong_so_bai_thi: number;
  };
}

// ==================== RANKING TYPES ====================

export interface Ranking {
  rank: number;
  sbd: string;
  toan: number | null;
  ngu_van: number | null;
  ngoai_ngu: number | null;
  vat_li: number | null;
  hoa_hoc: number | null;
  tong_diem: number;
}

export interface RankingsResponse {
  success: boolean;
  data: Ranking[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface RankingsQuery {
  limit?: number;
  offset?: number;
}

// ==================== SUBJECT INFO ====================

export interface SubjectInfo {
  key: 'toan' | 'ngu_van' | 'ngoai_ngu' | 'vat_li' | 'hoa_hoc' | 'sinh_hoc' | 'lich_su' | 'dia_li' | 'gdcd';
  name: string;
  shortName: string;
  color: string;
}

export const SUBJECTS: SubjectInfo[] = [
  { key: 'toan', name: 'Toán', shortName: 'Toán', color: '#4f46e5' },
  { key: 'ngu_van', name: 'Ngữ Văn', shortName: 'Văn', color: '#7c3aed' },
  { key: 'ngoai_ngu', name: 'Ngoại Ngữ', shortName: 'NN', color: '#0891b2' },
  { key: 'vat_li', name: 'Vật Lý', shortName: 'Lý', color: '#ea580c' },
  { key: 'hoa_hoc', name: 'Hóa Học', shortName: 'Hóa', color: '#16a34a' },
  { key: 'sinh_hoc', name: 'Sinh Học', shortName: 'Sinh', color: '#0891b2' },
  { key: 'lich_su', name: 'Lịch Sử', shortName: 'Sử', color: '#dc2626' },
  { key: 'dia_li', name: 'Địa Lý', shortName: 'Địa', color: '#16a34a' },
  { key: 'gdcd', name: 'GDCD', shortName: 'GDCD', color: '#db2777' },
];

// ==================== API ERROR ====================

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
