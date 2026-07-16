import { FormEvent, useState } from 'react';
import { useScoreSearch } from '../hooks';
import { SUBJECTS, type Score } from '../types';
import {
  Search,
  FileText,
  X,
  AlertCircle,
  Calculator,
  CheckCircle,
} from 'lucide-react';
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
function ScoreCard({
  subject,
  score,
}: {
  subject: typeof SUBJECTS[0];
  score: number | null;
}) {
  const scoreNum = score ?? 0;
  let scoreClass = 'neutral';
  if (score !== null) {
    if (scoreNum >= 8) scoreClass = 'excellent';
    else if (scoreNum >= 5) scoreClass = 'good';
    else scoreClass = 'poor';
  }

  return (
    <div className="score-card" style={{ borderLeftColor: subject.color }}>
      <span className="score-label">
        {subject.name}
        <span
          className="score-badge"
          style={{ background: subject.color }}
        >
          {subject.shortName}
        </span>
      </span>
      <span className={`score-value ${scoreClass}`}>{formatScore(score)}</span>
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

      {/* Search Container */}
      <div className="search-container">
        <form className="search-box" onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <Search size={20} className="search-input-icon" />
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
          </div>
          <button
            type="submit"
            className="search-btn"
            disabled={loading || !inputSbd.trim()}
          >
            <Search size={18} />
            {loading ? 'Đang tìm...' : 'Tra cứu'}
          </button>
          {inputSbd && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setInputSbd('');
                reset();
              }}
            >
              <X size={16} />
              Xóa
            </button>
          )}
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle size={20} className="error-icon" />
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
            <div className="result-header-content">
              <div className="result-header-icon">
                <CheckCircle size={24} />
              </div>
              <h3>Kết quả tra cứu</h3>
            </div>
            <div className="sbd-badge">
              <span>SBD:</span>
              <strong>{score.sbd}</strong>
            </div>
          </div>

          {/* Score Grid */}
          <div className="score-section">
            <h4>
              <FileText size={18} />
              Điểm các môn thi
            </h4>
            <div className="score-grid">
              {SUBJECTS.map((subject) => (
                <ScoreCard
                  key={subject.key}
                  subject={subject}
                  score={score[subject.key]}
                />
              ))}
            </div>
          </div>

          {/* Group Scores */}
          <div className="group-scores">
            <h4>
              <Calculator size={18} />
              Tổng hợp điểm theo khối
            </h4>
            <div className="group-grid">
              <div className="group-item">
                <span className="group-label">Khối A</span>
                <span className="group-value">Toán + Lý + Hóa</span>
                <span className="group-score">
                  {calcGroupAScore(score).toFixed(2)}
                </span>
              </div>
              <div className="group-item">
                <span className="group-label">Khối D</span>
                <span className="group-value">Toán + Văn + Ngoại ngữ</span>
                <span className="group-score">
                  {calcGroupDScore(score).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="result-footer">
            <p>
              <FileText size={14} />
              Điểm thi THPT Quốc gia 2024 - Kỳ thi ngày 27-28/06/2024
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!score && !loading && !error && (
        <div className="empty-state">
          <div className="empty-icon">
            <Search size={36} />
          </div>
          <p>Nhập số báo danh để tra cứu điểm thi của bạn</p>
        </div>
      )}
    </div>
  );
}
