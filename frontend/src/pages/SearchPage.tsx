import { useState } from 'react';
import './SearchPage.css';

export default function SearchPage() {
  const [sbd, setSbd] = useState('');

  return (
    <div className="search-page">
      <div className="search-hero">
        <h2>Tra cứu điểm thi THPT 2024</h2>
        <p>Nhập số báo danh để xem điểm thi của bạn</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Nhập số báo danh (VD: 01000001)"
          value={sbd}
          onChange={(e) => setSbd(e.target.value)}
          className="search-input"
        />
        <button className="search-btn">Tra cứu</button>
      </div>

      <div className="result-placeholder">
        <p>Kết quả sẽ hiển thị ở đây...</p>
      </div>
    </div>
  );
}
