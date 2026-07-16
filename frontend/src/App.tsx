import { useState } from 'react';
import { BarChart3, Search, LayoutDashboard } from 'lucide-react';
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
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <BarChart3 size={24} color="white" />
            </div>
            <div className="logo-text">
              G<span>-Scores</span>
            </div>
          </div>
        </div>
        <nav className="nav">
          <button
            className={`nav-btn ${currentPage === 'search' ? 'active' : ''}`}
            onClick={() => setCurrentPage('search')}
          >
            <Search size={18} />
            Tra cứu điểm
          </button>
          <button
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <LayoutDashboard size={18} />
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
        <p>G-Scores - Tra cứu điểm thi THPT 2024</p>
      </footer>
    </div>
  );
}

export default App;
