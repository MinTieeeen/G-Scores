/**
 * Custom Hook: useScoreSearch
 * Hook để tra cứu điểm thi theo SBD
 */

import { useState, useCallback } from 'react';
import { getScoreBySbd } from '../services/api';
import type { Score, ApiError } from '../types';

interface UseScoreSearchReturn {
  score: Score | null;
  loading: boolean;
  error: string | null;
  search: (sbd: string) => Promise<void>;
  reset: () => void;
}

export function useScoreSearch(): UseScoreSearchReturn {
  const [score, setScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (sbd: string) => {
    // Validate SBD format
    const trimmedSbd = sbd.trim();
    if (!trimmedSbd) {
      setError('Vui lòng nhập số báo danh');
      return;
    }

    if (!/^\d{8}$/.test(trimmedSbd)) {
      setError('Số báo danh phải gồm 8 chữ số');
      return;
    }

    setLoading(true);
    setError(null);
    setScore(null);

    try {
      const response = await getScoreBySbd({ sbd: trimmedSbd });
      if (response.success && response.data) {
        setScore(response.data);
      } else {
        setError('Không tìm thấy kết quả');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message || 'Đã xảy ra lỗi khi tra cứu');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setScore(null);
    setError(null);
    setLoading(false);
  }, []);

  return { score, loading, error, search, reset };
}
