import { useStatistics, useRankings } from '../hooks';
import { SUBJECTS, type SubjectStats } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Trophy,
  Users,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Award,
  Activity,
} from 'lucide-react';
import './DashboardPage.css';

// Type cho statistics data
type StatisticsData = {
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

// Màu sắc cho từng môn (matching mockup)
const SUBJECT_COLORS: Record<string, string> = {
  toan: '#3b82f6',
  ngu_van: '#8b5cf6',
  ngoai_ngu: '#06b6d4',
  vat_li: '#f97316',
  hoa_hoc: '#10b981',
  sinh_hoc: '#14b8a6',
  lich_su: '#ef4444',
  dia_li: '#22c55e',
  gdcd: '#ec4899',
};

/**
 * SubjectStatCard: Card hiển thị thống kê 1 môn
 */
function SubjectStatCard({
  subject,
  stats,
  formatNumber,
  formatScore,
}: {
  subject: typeof SUBJECTS[0];
  stats: SubjectStats | undefined;
  formatNumber: (num: number | undefined | null) => string;
  formatScore: (num: number | undefined | null) => string;
}) {
  if (!stats || typeof stats.so_luong !== 'number') return null;

  const color = SUBJECT_COLORS[subject.key] || '#3b82f6';

  return (
    <div
      className="stat-card"
      style={{ '--card-accent': color } as React.CSSProperties}
    >
      <div className="stat-header">
        <div className="stat-subject">
          <span className="stat-name">{subject.name}</span>
          <span className="stat-code" style={{ background: color }}>
            {subject.key.toUpperCase().replace('_', '')}
          </span>
        </div>
        <span className="stat-count">{formatNumber(stats.so_luong)} bài</span>
      </div>
      <div className="stat-metrics">
        <div className="stat-metric">
          <span className="stat-metric-label">Cao nhất</span>
          <span className="stat-metric-value high">
            {formatScore(stats.diem_cao_nhat)}
          </span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Trung bình</span>
          <span className="stat-metric-value avg">
            {formatScore(stats.trung_binh)}
          </span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Thấp nhất</span>
          <span className="stat-metric-value low">
            {formatScore(stats.diem_thap_nhat)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * RankingsTable: Bảng xếp hạng top 10
 */
function RankingsTable({
  rankings,
  loading,
}: {
  rankings: any[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="rankings-loading">
        <div className="spinner"></div>
        <span>Đang tải bảng xếp hạng...</span>
      </div>
    );
  }

  if (!rankings.length) {
    return (
      <div className="rankings-empty">
        <span>Không có dữ liệu xếp hạng</span>
      </div>
    );
  }

  return (
    <div className="rankings-table-wrapper">
      <table className="rankings-table">
        <thead>
          <tr>
            <th>Hạng</th>
            <th>SBD</th>
            <th>Toán</th>
            <th>Văn</th>
            <th>NN</th>
            <th>Lý</th>
            <th>Hóa</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((r) => (
            <tr key={r.sbd} className={r.rank <= 3 ? `top-${r.rank}` : ''}>
              <td>
                <span
                  className={`rank-badge ${
                    r.rank <= 3 ? `rank-${r.rank}` : 'rank-default'
                  }`}
                >
                  {r.rank <= 3 ? r.rank : r.rank}
                </span>
              </td>
              <td className="sbd-cell">{r.sbd}</td>
              <td>{r.toan?.toFixed(1) ?? '-'}</td>
              <td>{r.ngu_van?.toFixed(1) ?? '-'}</td>
              <td>{r.ngoai_ngu?.toFixed(1) ?? '-'}</td>
              <td>{r.vat_li?.toFixed(1) ?? '-'}</td>
              <td>{r.hoa_hoc?.toFixed(1) ?? '-'}</td>
              <td>{r.tong_diem?.toFixed(2) ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * DashboardPage: Trang thống kê và xếp hạng
 */
export default function DashboardPage() {
  const { statistics, loading: statsLoading, error: statsError } =
    useStatistics();
  const { rankings, total, loading: rankingsLoading } = useRankings(10);

  // Helper: Format số
  const formatNumber = (num: number | undefined | null): string => {
    return (num ?? 0).toLocaleString('vi-VN');
  };

  // Helper: Format điểm
  const formatScore = (num: number | undefined | null): string => {
    return (num ?? 0).toFixed(2);
  };

  // Chuẩn bị data cho biểu đồ
  const chartData = SUBJECTS.map((s) => {
    const subjectStats = statistics?.[s.key] as SubjectStats | undefined;
    return {
      name: s.shortName,
      'Điểm TB': subjectStats?.trung_binh ?? 0,
      'Cao nhất': subjectStats?.diem_cao_nhat ?? 0,
      'Thấp nhất': subjectStats?.diem_thap_nhat ?? 0,
    };
  });

  const tongSoBaiThi = (statistics as StatisticsData | null)?.tong_so_bai_thi;
  const soMonThi = SUBJECTS.length;

  // Chờ cả hai API load xong mới render — tránh flash dữ liệu rỗng
  const isLoading = statsLoading || rankingsLoading;

  if (statsError) {
    return (
      <div className="dashboard-page">
        <div className="error-state">
          <div className="error-icon">
            <AlertCircle size={32} color="#ef4444" />
          </div>
          <h3>Không thể tải dữ liệu</h3>
          <p>{statsError}</p>
          <button
            className="error-retry"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={18} />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Full-page loading skeleton — render khi bất kỳ API nào chưa xong
  if (isLoading) {
    return (
      <div className="dashboard-page">
        {/* Hero skeleton */}
        <section className="dashboard-hero dashboard-hero--skeleton">
          <div className="hero-content">
            <div className="skeleton-line skeleton-line--lg" />
            <div className="skeleton-line skeleton-line--sm" style={{ marginTop: '0.75rem' }} />
            <div className="hero-stats" style={{ marginTop: '1.5rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="hero-stat">
                  <div className="skeleton-circle" />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-line skeleton-line--sm" />
                    <div className="skeleton-line skeleton-line--md" style={{ marginTop: '0.4rem' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats cards skeleton */}
        <section className="dashboard-section">
          <div className="section-header">
            <div className="skeleton-line skeleton-line--md" style={{ width: '200px' }} />
          </div>
          <div className="loading-grid">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="stat-card skeleton">
                <div className="skeleton-header"></div>
                <div className="skeleton-body"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Rankings skeleton */}
        <section className="dashboard-section">
          <div className="section-header">
            <div className="skeleton-line skeleton-line--md" style={{ width: '180px' }} />
          </div>
          <div className="rankings-card">
            <div className="rankings-header">
              <div className="rankings-title">
                <div className="skeleton-line skeleton-line--md" style={{ width: '220px' }} />
                <div className="skeleton-line skeleton-line--sm" style={{ width: '100px', marginTop: '0.4rem' }} />
              </div>
            </div>
            <div className="rankings-loading">
              <div className="spinner"></div>
              <span>Đang tải dữ liệu...</span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <h2>
            <BarChart3 size={28} />
            Thống kê điểm thi THPT 2024
          </h2>
          <p>
            <TrendingUp size={18} />
            Tổng số bài thi: <strong>{formatNumber(tongSoBaiThi)}</strong>
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-icon">
                <Users size={20} />
              </div>
              <div className="hero-stat-info">
                <span className="hero-stat-label">Tổng thí sinh</span>
                <span className="hero-stat-value">
                  {formatNumber(total)}
                </span>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon">
                <Activity size={20} />
              </div>
              <div className="hero-stat-info">
                <span className="hero-stat-label">Số môn thi</span>
                <span className="hero-stat-value">{soMonThi}</span>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon">
                <Award size={20} />
              </div>
              <div className="hero-stat-info">
                <span className="hero-stat-label">Top thí sinh</span>
                <span className="hero-stat-value">10</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="dashboard-section">
        <div className="section-header">
          <h3 className="section-title">
            <div className="section-title-icon">
              <BarChart3 size={18} />
            </div>
            Thống kê theo môn thi
          </h3>
        </div>
        <div className="stats-grid">
          {SUBJECTS.map((subject) => (
            <SubjectStatCard
              key={subject.key}
              subject={subject}
              stats={statistics?.[subject.key] as SubjectStats | undefined}
              formatNumber={formatNumber}
              formatScore={formatScore}
            />
          ))}
        </div>
      </section>

      {/* Charts */}
      {statistics && (
        <section className="dashboard-section">
          <div className="section-header">
            <h3 className="section-title">
              <div className="section-title-icon">
                <TrendingUp size={18} />
              </div>
              Biểu đồ phân tích
            </h3>
          </div>
          <div className="charts-card">
            {/* Bar Chart - Điểm trung bình */}
            <div className="chart-wrapper">
              <h4>
                <Activity size={16} />
                Điểm trung bình các môn
              </h4>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                    }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar
                    dataKey="Điểm TB"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart - Cao nhất vs Thấp nhất */}
            <div className="chart-wrapper">
              <h4>
                <TrendingUp size={16} />
                Điểm cao nhất và thấp nhất
              </h4>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '0.875rem' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Cao nhất"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#10b981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Thấp nhất"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#ef4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* Rankings */}
      <section className="dashboard-section">
        <div className="section-header">
          <h3 className="section-title">
            <div className="section-title-icon">
              <Trophy size={18} />
            </div>
            Bảng xếp hạng Top 10
          </h3>
        </div>
        <div className="rankings-card">
          <div className="rankings-header">
            <div className="rankings-title">
              <h3>Top thí sinh điểm cao nhất</h3>
              <span className="rankings-count">
                {formatNumber(total)} thí sinh
              </span>
            </div>
          </div>
          <RankingsTable rankings={rankings} loading={false} />
        </div>
      </section>
    </div>
  );
}
