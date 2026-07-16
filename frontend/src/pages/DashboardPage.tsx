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

/**
 * Helper: Format số
 */
function formatNumber(num: number): string {
  return num.toLocaleString('vi-VN');
}

/**
 * Helper: Format điểm
 */
function formatScore(num: number | undefined): string {
  return (num ?? 0).toFixed(2);
}

/**
 * SubjectStatCard: Card hiển thị thống kê 1 môn
 */
function SubjectStatCard({ subject, stats }: { subject: typeof SUBJECTS[0]; stats: SubjectStats | undefined }) {
  if (!stats) return null;

  return (
    <div className="stat-card" style={{ borderTopColor: subject.color }}>
      <div className="stat-header">
        <span className="stat-name">{subject.name}</span>
        <span className="stat-count">{formatNumber(stats.so_luong)}</span>
      </div>
      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-label">Cao nhất</span>
          <span className="stat-value high">{formatScore(stats.diem_cao_nhat)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">TB</span>
          <span className="stat-value avg">{formatScore(stats.trung_binh)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Thấp nhất</span>
          <span className="stat-value low">{formatScore(stats.diem_thap_nhat)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * RankingsTable: Bảng xếp hạng top 10
 */
function RankingsTable({ rankings, loading }: { rankings: any[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="rankings-loading">
        <div className="spinner small"></div>
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
                <span className={`rank-badge rank-${r.rank}`}>
                  {r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank}
                </span>
              </td>
              <td className="sbd-cell">{r.sbd}</td>
              <td>{r.toan?.toFixed(1) ?? '-'}</td>
              <td>{r.ngu_van?.toFixed(1) ?? '-'}</td>
              <td>{r.ngoai_ngu?.toFixed(1) ?? '-'}</td>
              <td>{r.vat_li?.toFixed(1) ?? '-'}</td>
              <td>{r.hoa_hoc?.toFixed(1) ?? '-'}</td>
              <td className="total-cell">{r.tong_diem.toFixed(2)}</td>
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
  const { statistics, loading: statsLoading, error: statsError } = useStatistics();
  const { rankings, total, loading: rankingsLoading } = useRankings(10);

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

  if (statsError) {
    return (
      <div className="dashboard-page">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h3>Không thể tải dữ liệu</h3>
          <p>{statsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>Thống kê điểm thi THPT 2024</h2>
          <p>Tổng số bài thi: <strong>{(statistics as StatisticsData | null)?.tong_so_bai_thi ? formatNumber((statistics as StatisticsData).tong_so_bai_thi) : '...'}</strong></p>
        </div>
        <div className="refresh-btn" onClick={() => window.location.reload()}>
          🔄 Tải lại
        </div>
      </div>

      {/* Statistics Cards */}
      <section className="stats-section">
        <h3>📊 Thống kê theo môn thi</h3>
        {statsLoading ? (
          <div className="loading-grid">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="stat-card skeleton">
                <div className="skeleton-header"></div>
                <div className="skeleton-body"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="stats-grid">
            {SUBJECTS.map((subject) => (
              <SubjectStatCard
                key={subject.key}
                subject={subject}
                stats={statistics?.[subject.key] as SubjectStats | undefined}
              />
            ))}
          </div>
        )}
      </section>

      {/* Charts */}
      <section className="charts-section">
        <h3>📈 Biểu đồ điểm thi</h3>

        {/* Bar Chart - Điểm trung bình */}
        <div className="chart-container">
          <h4>Điểm trung bình các môn</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
              <YAxis domain={[0, 10]} tick={{ fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="Điểm TB" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Cao nhất vs Thấp nhất */}
        <div className="chart-container">
          <h4>Điểm cao nhất và thấp nhất</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
              <YAxis domain={[0, 10]} tick={{ fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Cao nhất" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a' }} />
              <Line type="monotone" dataKey="Thấp nhất" stroke="#dc2626" strokeWidth={2} dot={{ fill: '#dc2626' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Rankings */}
      <section className="rankings-section">
        <div className="rankings-header">
          <div>
            <h3>🏆 Bảng xếp hạng Top 10</h3>
            <p>Tổng số thí sinh: {formatNumber(total)}</p>
          </div>
        </div>
        <RankingsTable rankings={rankings} loading={rankingsLoading} />
      </section>
    </div>
  );
}
