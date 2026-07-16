/**
 * Custom Hook: useRankings
 * Hook để lấy bảng xếp hạng top học sinh
 */

import { useState, useEffect, useCallback } from 'react';
import { getRankings } from '../services/api';
import type { Ranking, ApiError } from '../types';

interface UseRankingsReturn {
  rankings: Ranking[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => void;
}

export function useRankings(initialLimit: number = 10): UseRankingsReturn {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchRankings = useCallback(async (reset: boolean = false) => {
    const currentOffset = reset ? 0 : offset;

    setLoading(true);
    setError(null);

    try {
      const response = await getRankings({
        limit: initialLimit,
        offset: currentOffset
      });

      if (response.success && response.data) {
        if (reset) {
          setRankings(response.data);
        } else {
          setRankings(prev => [...prev, ...response.data]);
        }
        setTotal(response.pagination.total);
        setHasMore(response.data.length === initialLimit);
        setOffset(currentOffset + response.data.length);
      } else {
        setError('Không thể tải bảng xếp hạng');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message || 'Đã xảy ra lỗi khi tải xếp hạng');
    } finally {
      setLoading(false);
    }
  }, [initialLimit, offset]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchRankings(true);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchRankings(false);
    }
  }, [fetchRankings, loading, hasMore]);

  return {
    rankings,
    total,
    loading,
    error,
    refetch: () => fetchRankings(true),
    loadMore
  };
}
