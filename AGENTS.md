# TOKDAK — Agent Guide

## Quick start

```bash
# Backend (Express, CommonJS)
cd backend && npm install && npm run dev   # nodemon on port 5000

# Frontend (React + Vite, ESM)
cd frontend && npm install && npm run dev  # Vite on port 3000
```

## Architecture

**Backend** (`backend/server.js` → `backend/src/app.js`)
- Layered: `routes/` → `controllers/` → `services/` → `repositories/` → MySQL
- `models/index.js` is empty — query logic lives in repositories, not models
- Every request from a non-admin user gets `req.shop_id` attached via `attachShop.middleware.js`
- Auth: JWT (`tokdak_token` in localStorage), role middleware: `'admin'` or `'client'`
- Swagger at `http://localhost:5000/api-docs` (annotations in route files)
- File uploads via multer go to `backend/uploads/`

**Frontend** (`frontend/index.html` → `main.jsx` → `App.jsx`)
- React Router v6: `/admin/*` (active), `/client/*` (currently commented out in `App.jsx`)
- Axios instance in `services/axiosInstance.js` reads `VITE_API_URL`, auto-attaches Bearer token, redirects on 401
- CSS files in `styles/`, not CSS modules

## Commands

| Package | Command | Purpose |
|---------|---------|---------|
| backend | `npm start` | `node server.js` |
| backend | `npm run dev` | `nodemon server.js` (auto-restart) |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Vite build |
| frontend | `npm run preview` | Vite preview |

No test, lint, or typecheck scripts exist.

## Database

- MySQL, pool config in `backend/src/config/db.js`
- Schema: `backend/database/schema.sql` — run first, then `backend/database/seed.sql`
- Seed password for all users is `123456` (bcrypt `$2b$10$36PPrQ1GEG...`)
- Migrations: `backend/database/migrations/`
- `.env` files (both backend and frontend) are committed — do not rotate credentials without asking

## Conventions & quirks

- Backend uses **CommonJS** (`require`/`module.exports`). Do not add `"type": "module"`.
- `backend/hash.js` uses `import` syntax — this file is broken; do not use it as a pattern.
- Route files use lowercase with dots: `auth.routes.js`, `shop_settings.routes.js`.
- The `userTemp` table in migrations is a scratch table for registration temp data — do not confuse with `users`.
- `VITE_API_URL` is required in `frontend/.env` — currently `http://localhost:5000/api`.
- Client routes exist in `frontend/src/routes/ClientRoutes.jsx` but are disabled in `App.jsx`.
