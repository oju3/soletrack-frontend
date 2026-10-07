# SoleTrack

SoleTrack is a sneaker resale valuation platform. It helps resellers see what a pair is worth, where the price is heading, and whether to hold or sell, then tracks their portfolio and realized profit over time.

Live app: https://soletrack-frontend.vercel.app

Backend repo: https://github.com/oju3/Resell-Value-Project

## What it does

- **Search** the sneaker catalog by name or style code.
- **Valuation** for each pair, with a price comparison across platforms.
- **Projection** of where the price is likely heading, shown on a chart.
- **HOLD / SELL recommendation** based on the projection and platform fees.
- **Portfolio** of pairs you own, with unrealized profit and loss against what you paid.
- **Mark as sold** to record the sale platform, price, and date.
- **Sales history** with realized profit and loss, net of platform fees. Figures are frozen at sale time, so later fee changes do not rewrite history.
- **Accounts** with email and password sign-in.

Valuations and recommendations are estimates, not financial advice.

## How it works

This repo is the frontend. It is a React single-page app that talks to a FastAPI backend over a REST API. Sign-in is handled by Supabase Auth, and the frontend sends the user's token with each request so every user only sees their own portfolio and sales.

The data pipeline, projection engine, and HOLD/SELL logic live in the backend repo.

```
Browser (React, Vercel)  ->  FastAPI API (Render)  ->  Postgres (Supabase)
            \__________ Supabase Auth (JWT) __________/
```

## Tech stack

- React and Vite
- Tailwind CSS v4 and shadcn/ui
- React Router
- Recharts for charts
- Motion for animation
- Lucide for icons

Hosting: Vercel (frontend), Render (backend), Supabase (database and auth).

## Run it locally

You need Node.js and a running copy of the backend (see the backend repo).

```
npm install
```

Create a `.env` file in the project root:

```
VITE_API_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Then start the dev server:

```
npm run dev
```

The app runs at http://localhost:5173.

## Project structure

```
src/
  api.js          API base URL and session-expiry handling
  main.jsx        Routes
  Hub.jsx         Home screen
  App.jsx         Sneaker search
  SneakerDetail.jsx   Valuation, chart, and recommendation
  Portfolio.jsx   Owned pairs and mark-as-sold flow
  AddPair.jsx     Add a pair to the portfolio
  SalesHistory.jsx    Sold pairs and realized profit and loss
```

## Notes

The backend runs on a free tier, so the first request after a quiet period can take up to a minute while it wakes up.
