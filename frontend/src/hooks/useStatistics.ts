/**
 * Custom Hook: useStatistics
 * Hook để lấy thống kê điểm thi
 */

import { useState, useEffect, useCallback } from 'react';
import { getStatistics } from '../services/api';
import type { StatisticsResponse, ApiError } from '../types';

interface UseStatisticsReturn {
  statistics: StatisticsResponse['data'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStatistics(): UseStatisticsReturn {
  const [statistics, setStatistics] = useState<StatisticsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getStatistics();
      if (response.success && response.data) {
        setStatistics(response.data);
      } else {
        setError('Không thể tải dữ liệu thống kê');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message || 'Đã xảy ra lỗi khi tải thống kê');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { statistics, loading, error, refetch: fetchStatistics };
}
