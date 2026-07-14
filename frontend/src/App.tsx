import { useState } from 'react';
import SearchPage from './pages/SearchPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

type Page = 'search' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('search');

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="logo">📊 G-Scores</h1>
        <nav className="nav">
          <button
            className={`nav-btn ${currentPage === 'search' ? 'active' : ''}`}
            onClick={() => setCurrentPage('search')}
          >
            Tra cứu điểm
          </button>
          <button
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            Thống kê
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main">
        {currentPage === 'search' ? <SearchPage /> : <DashboardPage />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>G-Scores - Đồ án thực tập Web Developer @ Golden Owl</p>
      </footer>
    </div>
  );
}

export default App;
