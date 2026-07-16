/**
 * API Service cho G-Scores Frontend
 * Giao tiếp với NestJS Backend
 */

import axios, { AxiosError } from "axios";
import type {
  ScoreResponse,
  ScoreQuery,
  StatisticsResponse,
  RankingsResponse,
  RankingsQuery,
  ApiError,
} from "../types";

// API Base URL - đọc từ env hoặc dùng default
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4001/api";

// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s timeout cho các query nặng
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - log request
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor - xử lý lỗi
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Server trả lỗi
      const { status, data } = error.response;
      console.error(`[API] Error ${status}:`, data?.message || data?.error);
      return Promise.reject(data || error);
    } else if (error.request) {
      // Không nhận được response
      console.error("[API] No response from server");
      return Promise.reject({
        success: false,
        error: "NETWORK_ERROR",
        message:
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
        statusCode: 0,
      });
    }
    return Promise.reject(error);
  },
);

/**
 * Tra cứu điểm thi theo SBD
 * GET /api/scores/:sbd
 */
export async function getScoreBySbd(query: ScoreQuery): Promise<ScoreResponse> {
  const response = await apiClient.get<ScoreResponse>(`/scores/${query.sbd}`);
  return response.data;
}

/**
 * Lấy thống kê điểm thi
 * GET /api/statistics
 */
export async function getStatistics(): Promise<StatisticsResponse> {
  const response = await apiClient.get<StatisticsResponse>("/statistics");
  return response.data;
}

/**
 * Lấy bảng xếp hạng
 * GET /api/rankings?limit=10&offset=0
 */
export async function getRankings(
  query: RankingsQuery = {},
): Promise<RankingsResponse> {
  const { limit = 10, offset = 0 } = query;
  const response = await apiClient.get<RankingsResponse>("/rankings", {
    params: { limit, offset },
  });
  return response.data;
}

// Export instance để sử dụng trực tiếp nếu cần
export { apiClient };
