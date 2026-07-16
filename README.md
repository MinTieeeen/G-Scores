# G-Scores

Ứng dụng web tra cứu điểm thi THPT 2024 Việt Nam.

## 🚀 Quick Start

### Development

```bash
# 1. Start Database
docker-compose up -d

# 2. Backend
cd backend
npm install
npm run start:dev

# 3. Frontend (terminal khác)
cd frontend
npm install
npm run dev
```

### Deployment

Xem [DEPLOY.md](DEPLOY.md) để biết cách deploy lên:
- **Database**: Neon PostgreSQL
- **Backend**: Railway (NestJS)
- **Frontend**: Vercel (React)

## 📁 Project Structure

```
gscores/
├── backend/           # NestJS API
│   ├── src/
│   │   ├── modules/   # Feature modules (scores, statistics, rankings)
│   │   ├── common/    # Shared decorators, interfaces, utils
│   │   └── database/  # Database setup & seeders
│   └── package.json
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── services/  # API services
│   │   └── types/     # TypeScript types
│   └── package.json
├── docker-compose.yml  # PostgreSQL database (development)
├── dataset/            # Source data (CSV)
├── DEPLOY.md          # Deployment guide
└── WORKFLOW.md        # Development workflow & business logic
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scores/:sbd` | Tra cứu điểm theo số báo danh |
| GET | `/api/statistics` | Thống kê điểm theo môn |
| GET | `/api/rankings` | Top N học sinh nhóm A |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, Recharts, Lucide Icons |
| Backend | NestJS, TypeORM, PostgreSQL |
| Database | PostgreSQL 16 (dev: Docker, prod: Neon) |
| CI/CD | GitHub Actions, Vercel, Railway |

## 📋 Features

- [x] Tra cứu điểm thi theo SBD
- [x] Thống kê điểm theo môn (max, min, trung bình)
- [x] Bảng xếp hạng Top N học sinh
- [x] Biểu đồ trực quan (Bar chart, Line chart)
- [x] Responsive UI
- [x] Rate limiting (100 req/phút)
- [x] Caching (5 phút cho statistics)

## 📝 Development

```bash
# Run tests
cd backend && npm test

# Build frontend
cd frontend && npm run build

# Seed data (development)
cd backend && npm run seed
```

## 👤 Author

G-Scores - Tra cứu điểm thi THPT 2024
