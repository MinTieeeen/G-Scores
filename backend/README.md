# G-Scores Backend

A RESTful API for managing and querying student exam scores, built with **NestJS** and **PostgreSQL**.

## 🚀 Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL (with TypeORM)
- **Deployment**: Railway
- **Database Hosting**: Neon (Serverless PostgreSQL)

## 📋 Features

- Query student scores by registration number
- Statistical analysis by subject and score range
- Top performer rankings
- Seeding 1M+ student records from CSV dataset

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── app.module.ts         # Root module with DB config
│   ├── main.ts               # Entry point with CORS config
│   ├── scores/
│   │   ├── scores.module.ts
│   │   ├── scores.controller.ts
│   │   ├── scores.service.ts
│   │   └── score.entity.ts
│   └── database/
│       └── seed.ts           # CSV seeder script
├── Procfile                  # Railway deployment config
├── .env.example              # Environment variable template
└── package.json
```

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=gscores

# Or use a connection string (e.g., Neon)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

## 🛠️ Local Development

### Prerequisites

- Node.js >= 18
- PostgreSQL (local) or a Neon database URL

### Setup

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Edit .env with your database credentials

# Run in development mode (with hot-reload)
npm run start:dev
```

The API will be available at `http://localhost:3001`.

### Seed the Database

```bash
# Seed from CSV dataset (place diem_thi_thpt_2024.csv in ../dataset/)
npm run seed
```

### Run Tests

```bash
npm test
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/scores/:sbd` | Get score by registration number |
| `GET` | `/scores/statistics/by-subject` | Score distribution by subject |
| `GET` | `/scores/statistics/top-students` | Top students by subject |

### Example

```bash
# Get scores for student
curl http://localhost:3001/scores/01000001

# Get statistics
curl http://localhost:3001/scores/statistics/by-subject
```

## 🚢 Deployment (Railway)

1. Push this repository to GitHub
2. Create a new Railway project and connect the GitHub repo
3. Add environment variables in Railway dashboard:
   - `DATABASE_URL` — Neon connection string
   - `NODE_ENV=production`
   - `PORT=3001` (Railway sets this automatically)
4. Railway will auto-detect the `Procfile` and deploy

### Procfile

```
web: npm run start:prod
```

## 🗄️ Database (Neon)

This backend connects to a **Neon Serverless PostgreSQL** database. SSL is automatically enabled when `DATABASE_URL` is provided.

The TypeORM config (`src/app.module.ts`) supports both:
- Local DB via individual `DB_*` env vars
- Cloud DB via `DATABASE_URL` with auto-SSL

## 📄 License

MIT
