# G-Scores

This is the instruction for web developer intern assignment at [Golden Owl](https://goldenowl.asia).

## Project Structure

```
gscores/
├── backend/           # NestJS API
│   ├── src/
│   │   ├── modules/   # Feature modules (scores, statistics, rankings)
│   │   ├── common/    # Shared decorators, interfaces, utils
│   │   ├── config/    # Configuration
│   │   └── database/  # Database setup & seeders
│   └── package.json
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/# Reusable components
│   │   ├── services/  # API services
│   │   ├── hooks/     # Custom React hooks
│   │   └── types/     # TypeScript types
│   └── package.json
├── docker-compose.yml # PostgreSQL database
└── dataset/           # Source data (CSV)
```

## Quick Start

### 1. Start Database
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Seed Data (optional)
```bash
cd backend
npm run seed
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scores/:sbd` | Tra cứu điểm theo số báo danh |
| GET | `/api/statistics` | Thống kê điểm theo 4 mức |
| GET | `/api/rankings/top-10` | Top 10 học sinh nhóm A |

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Recharts
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Database**: PostgreSQL 16
