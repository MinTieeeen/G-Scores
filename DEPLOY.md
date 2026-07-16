# 🚀 G-Scores Deployment Guide

Hướng dẫn deploy G-Scores lên production với 3 services miễn phí.

## 📋 Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
└─────────────────────────────────────────────────────────────────┘
                    ▲                    ▲
                    │                    │
              ┌─────┴─────┐        ┌─────┴─────┐
              │  Vercel   │        │  Railway   │
              │ (Frontend)│        │ (Backend)  │
              │  React    │        │  NestJS    │
              └─────┬─────┘        └─────┬─────┘
                    │                    │
                    │   HTTPS/WSS        │ HTTPS
                    │                    │
              ┌─────┴─────┐        ┌─────┴─────┐
              │  Browser  │◄──────►│  Railway   │
              │   User    │        │(PostgreSQL)│
              └───────────┘        └───────────┘
```

## 🎯 Deployment Steps Overview

| Bước | Service | Mô tả |
|------|---------|-------|
| 1 | Neon | Tạo PostgreSQL database |
| 2 | Railway | Deploy NestJS backend |
| 3 | Vercel | Deploy React frontend |
| 4 | Config | Cập nhật API URLs |

---

## Step 1: Tạo Database (Neon) ⭐

### 1.1. Đăng ký Neon

1. Truy cập [neon.tech](https://neon.tech)
2. Sign up với GitHub account (nhanh nhất)
3. Click **Create Project**

### 1.2. Cấu hình Project

```
Project Name: gscores
Database Name: gscores
Region: Singapore (gần nhất với Railway)
```

### 1.3. Lấy Connection String

Sau khi tạo xong, bạn sẽ có connection string:

```bash
postgresql://username:password@ep-xxx-xxx-123456.singapore.neon.tech/gscores?sslmode=require
```

**Lưu lại connection string này** - sẽ cần cho Railway ở bước 2.

### 1.4. Tạo Database Schema

Neon có built-in SQL Editor. Chạy migration để tạo bảng:

```sql
CREATE TABLE IF NOT EXISTS scores (
    sbd VARCHAR(8) PRIMARY KEY,
    toan DECIMAL(4,2),
    ngu_van DECIMAL(4,2),
    ngoai_ngu DECIMAL(4,2),
    vat_li DECIMAL(4,2),
    hoa_hoc DECIMAL(4,2),
    sinh_hoc DECIMAL(4,2),
    lich_su DECIMAL(4,2),
    dia_li DECIMAL(4,2),
    gdcd DECIMAL(4,2),
    ma_ngoai_ngu VARCHAR(5)
);

-- Indexes cho performance
CREATE INDEX IF NOT EXISTS idx_scores_toan ON scores(toan);
CREATE INDEX IF NOT EXISTS idx_scores_vat_li ON scores(vat_li);
CREATE INDEX IF NOT EXISTS idx_scores_hoa_hoc ON scores(hoa_hoc);
```

---

## Step 2: Deploy Backend (Railway)

### 2.1. Đăng ký Railway

1. Truy cập [railway.app](https://railway.app)
2. Sign up với GitHub
3. Get **$5 free credit/month** (đủ cho project này)

### 2.2. Tạo New Project

1. Click **New Project** → **Deploy from GitHub repo**
2. Chọn repository `webdev-intern-assignment-3`
3. Chọn **backend** folder làm root

### 2.3. Cấu hình Environment Variables

Trong Railway dashboard → **Settings** → **Environment Variables**:

```env
# Database (từ Neon)
DB_HOST=ep-xxx-xxx-123456.singapore.neon.tech
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=gscores

# Server
PORT=4000
NODE_ENV=production

# CORS - sẽ cập nhật sau khi deploy frontend
FRONTEND_URL=https://gscores.vercel.app
```

**Database URL cho TypeORM** (thay thế các biến trên bằng):

```env
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-123456.singapore.neon.tech/gscores?sslmode=require
```

### 2.4. Update Backend Code

Railway cần file `Procfile` để biết cách chạy app:

```bash
# Tạo file Procfile trong backend/
echo "web: npm run start:prod" > backend/Procfile
```

### 2.5. Deploy

1. Railway sẽ tự động detect NestJS và deploy
2. Theo dõi logs trong **Deployments** tab
3. Sau khi deploy thành công, copy **URL** (VD: `https://gscores-backend.up.railway.app`)

### 2.6. Seed Data (Optional)

Sau khi deploy, chạy seed script để thêm dữ liệu:

```bash
# SSH vào Railway container hoặc dùng Railway CLI
railway run npm run seed
```

Hoặc đơn giản hơn - copy file `seed.ts` content và chạy qua Neon SQL Editor.

---

## Step 3: Deploy Frontend (Vercel)

### 3.1. Đăng ký Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Sign up với GitHub

### 3.2. Import Project

1. Click **Add New** → **Project**
2. Import repository `webdev-intern-assignment-3`
3. Set **Root Directory**: `frontend`

### 3.3. Cấu hình Build Settings

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

### 3.4. Environment Variables

Trong **Environment** → **Variables**:

```env
VITE_API_URL=https://gscores-backend.up.railway.app/api
```

### 3.5. Deploy

1. Click **Deploy**
2. Sau khi xong, bạn sẽ có URL: `https://gscores.vercel.app`

### 3.6. Update Backend CORS

Quay lại Railway → Backend Settings → Update:

```env
FRONTEND_URL=https://gscores.vercel.app
```

---

## Step 4: Cập nhật Config cuối cùng

### 4.1. Local Development

Tạo/update file `frontend/.env`:

```env
# Development - dùng local backend
VITE_API_URL=http://localhost:4000/api
```

Tạo/update file `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gscores
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4.2. Verify Deployment

Truy cập:
- Frontend: `https://gscores.vercel.app`
- Backend Health: `https://gscores-backend.up.railway.app/api`

Test endpoint:
```bash
curl https://gscores-backend.up.railway.app/api/statistics
```

---

## 🔧 Troubleshooting

### Backend Issues

**1. Database Connection Failed**
```
Error: getaddrinfo ENOTFOUND
```
→ Kiểm tra DB_HOST trong Railway environment variables

**2. CORS Error**
```
Access to fetch at 'https://gscores-backend...' from origin 'https://gscores.vercel.app' has been blocked by CORS policy
```
→ Thêm `FRONTEND_URL` vào Railway environment variables

**3. 500 Internal Server Error**
→ Check Railway logs, thường do DATABASE_URL format

### Frontend Issues

**1. API 404**
```
Cannot GET /api/scores/...
```
→ Kiểm tra `VITE_API_URL` đúng format: `https://your-backend.railway.app/api`

**2. Build Failed**
→ Ensure Node.js version >= 18 in Vercel settings

---

## 💰 Chi phí

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Neon | 0.5GB storage | Đủ cho ~100k records |
| Railway | 500h/month | Backend + computations |
| Vercel | Unlimited | Không giới hạn bandwidth |

**Tổng: $0/month** cho project này

---

## 🔄 CI/CD Setup (Optional)

Sau khi deploy, bạn có thể setup auto-deploy:

1. **Railway**: Auto-deploy khi push to `main`
2. **Vercel**: Auto-deploy khi push to `main`

Không cần GitHub Actions cho deployment vì Railway/Vercel handle CI/CD tự động.

---

## 📞 Quick Commands

```bash
# Check backend health
curl https://gscores-backend.up.railway.app/api

# Check statistics
curl https://gscores-backend.up.railway.app/api/statistics

# Test specific SBD
curl https://gscores-backend.up.railway.app/api/scores/01000001
```

---

## 🎉 Done!

Sau khi hoàn thành, ứng dụng của bạn sẽ có:

- ✅ **Frontend**: https://gscores.vercel.app
- ✅ **Backend API**: https://gscores-backend.up.railway.app/api
- ✅ **Database**: Neon PostgreSQL

Chúc bạn deploy thành công! 🚀
