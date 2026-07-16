# G-Scores Frontend

A modern web application for exploring and visualizing Vietnamese high school exam scores (THPT 2024), built with **React** + **Vite**.

## 🚀 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Charts**: Recharts
- **Icons**: lucide-react
- **HTTP Client**: Axios
- **Deployment**: Vercel

## 📋 Features

- 🔍 Search student scores by registration number (SBD)
- 📊 Interactive score distribution charts by subject
- 🏆 Top performers leaderboard
- 📱 Fully responsive design (mobile-friendly)
- 🎨 Modern navy gradient UI with smooth animations

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── App.tsx               # Root app with navigation
│   ├── main.tsx              # Entry point
│   ├── index.css             # Global styles & design tokens
│   ├── pages/
│   │   ├── DashboardPage.tsx # Overview & statistics
│   │   ├── SearchPage.tsx    # Score lookup by SBD
│   │   └── RankingsPage.tsx  # Top student rankings
│   ├── components/           # Reusable UI components
│   └── api/
│       └── api.ts            # Axios API client
├── public/                   # Static assets
├── vercel.json               # Vercel deployment config
├── vite.config.ts            # Vite configuration
└── package.json
```

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:3001
```

For production (Vercel), set:

```env
VITE_API_URL=https://your-backend-url.railway.app
```

## 🛠️ Local Development

### Prerequisites

- Node.js >= 18
- Backend running at `http://localhost:3001` (see [gscores-backend](https://github.com/MinTieeeen/gscores-backend))

### Setup

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Edit VITE_API_URL to point to your backend

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 Pages

### Dashboard (`/`)
- Overview stats: total students, subjects, top scorers
- Score distribution bar chart
- Quick navigation cards

### Search (`/search`)
- Input a student registration number (SBD)
- View full score breakdown across all subjects
- Color-coded score indicators

### Rankings (`/rankings`)
- Select subject to view top performers
- Leaderboard table with score highlights

## 🚢 Deployment (Vercel)

1. Push this repository to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add environment variable:
   - `VITE_API_URL` — Your Railway backend URL
4. Vercel auto-detects Vite and deploys

### vercel.json

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This enables client-side routing for React Router.

## 🎨 Design System

The app uses a **navy gradient** design language:

| Token | Value |
|-------|-------|
| Primary | `#1e3a5f` → `#2d6a9f` |
| Accent | `#4fc3f7` |
| Background | `#0a1628` |
| Card | `rgba(255,255,255,0.05)` |
| Border | `rgba(255,255,255,0.1)` |

Fonts: **Inter** (Google Fonts)

## 🔗 Related

- **Backend Repo**: [gscores-backend](https://github.com/MinTieeeen/gscores-backend)
- **Live Demo**: Deployed on Vercel

## 📄 License

MIT
