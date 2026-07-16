import { FormEvent, useState } from 'react';
import { useScoreSearch } from '../hooks';
import { SUBJECTS, type Score } from '../types';
import './SearchPage.css';

/**
 * Helper: Format điểm số
 */
function formatScore(score: number | null): string {
  if (score === null) return '-';
  return score.toFixed(2);
}

/**
 * Helper: Tính tổng điểm khối A (Toán, Lý, Hóa)
 */
function calcGroupAScore(score: Score): number {
  const toan = score.toan ?? 0;
  const vatLi = score.vat_li ?? 0;
  const hoaHoc = score.hoa_hoc ?? 0;
  return toan + vatLi + hoaHoc;
}

/**
 * Helper: Tính tổng điểm khối D (Toán, Văn, NN)
 */
function calcGroupDScore(score: Score): number {
  const toan = score.toan ?? 0;
  const nguVan = score.ngu_van ?? 0;
  const ngoaiNgu = score.ngoai_ngu ?? 0;
  return toan + nguVan + ngoaiNgu;
}

/**
 * ScoreCard: Hiển thị điểm 1 môn
 */
function ScoreCard({ subject, score }: { subject: typeof SUBJECTS[0]; score: number | null }) {
  const scoreNum = score ?? 0;
  const bgColor = scoreNum >= 8 ? '#dcfce7' : scoreNum >= 5 ? '#fef9c3' : '#fee2e2';

  return (
    <div className="score-card" style={{ borderLeftColor: subject.color }}>
      <span className="score-label">{subject.name}</span>
      <span className="score-value" style={{ backgroundColor: bgColor }}>
        {formatScore(score)}
      </span>
    </div>
  );
}

/**
 * SearchPage: Trang tra cứu điểm thi
 */
export default function SearchPage() {
  const [inputSbd, setInputSbd] = useState('');
  const { score, loading, error, search, reset } = useScoreSearch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    search(inputSbd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <div className="search-page">
      {/* Hero Section */}
      <div className="search-hero">
        <h2>Tra cứu điểm thi THPT 2024</h2>
        <p>Nhập số báo danh để xem điểm thi của bạn</p>
      </div>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Nhập số báo danh (VD: 01000001)"
          value={inputSbd}
          onChange={(e) => {
            setInputSbd(e.target.value);
            if (error) reset();
          }}
          onKeyDown={handleKeyDown}
          className="search-input"
          maxLength={8}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <button
          className="search-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Đang tìm...' : 'Tra cứu'}
        </button>
        {inputSbd && (
          <button className="clear-btn" onClick={() => { setInputSbd(''); reset(); }}>
            ✕
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tra cứu điểm thi...</p>
        </div>
      )}

      {/* Results */}
      {score && !loading && (
        <div className="result-card">
          {/* Header */}
          <div className="result-header">
            <h3>Kết quả tra cứu</h3>
            <span className="sbd-badge">SBD: {score.sbd}</span>
          </div>

          {/* Score Grid */}
          <div className="score-grid">
            {SUBJECTS.map((subject) => (
              <ScoreCard
                key={subject.key}
                subject={subject}
                score={score[subject.key]}
              />
            ))}
          </div>

          {/* Group Scores */}
          <div className="group-scores">
            <h4>Tổng hợp điểm</h4>
            <div className="group-grid">
              <div className="group-item">
                <span className="group-label">Khối A</span>
                <span className="group-value">A00 (Toán, Lý, Hóa)</span>
                <span className="group-score">{calcGroupAScore(score).toFixed(2)}</span>
              </div>
              <div className="group-item">
                <span className="group-label">Khối D</span>
                <span className="group-value">D01 (Toán, Văn, NN)</span>
                <span className="group-score">{calcGroupDScore(score).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="result-footer">
            <p>📌 Điểm thi THPT Quốc gia 2024 - Kỳ thi ngày 27-28/06/2024</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!score && !loading && !error && (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p>Nhập số báo danh để tra cứu điểm thi của bạn</p>
        </div>
      )}
    </div>
  );
}
