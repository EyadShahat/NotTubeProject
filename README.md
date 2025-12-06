# NotTube

Full-stack YouTube-like demo. React 19 + Vite front end, Node/Express + MongoDB backend with JWT auth, Supabase uploads, and admin flagging/review flows.

## Quick start (local)
```bash
# backend
cd backend
npm install
cp .env.example .env   # add your secrets
npm run dev            # http://localhost:4000

# frontend
cd ../nottube
npm install
cp .env.example .env   # set VITE_API_URL if not using localhost
npm run dev            # http://localhost:5173
```

## Environment variables
`backend/.env` (see `.env.example`):
- `PORT` (default 4000)
- `MONGODB_URI` MongoDB connection string
- `JWT_SECRET` secret key
- `CLIENT_ORIGIN` comma-separated allowed origins (e.g. `http://localhost:5173,https://your-site.com`)
- `ADMIN_EMAILS` comma-separated admin emails
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET` for uploads

`nottube/.env` (see `.env.example`):
- `VITE_API_URL` REST base, include `/api` (e.g. `https://your-api.com/api`). If omitted, dev defaults to `http://localhost:4000/api` and prod falls back to same-origin `/api`.

## Scripts
Backend:
- `npm run dev` — start API with nodemon
- `npm test` / `npm run lint` — add your own tests/linting as needed

Frontend:
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview built app

## API surface (summary)
- Auth: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/profile`, `POST /api/auth/subscriptions/toggle`
- Videos: list/search/create/update/delete, like/save/watch (`/api/videos...`)
- Comments: list/create/delete (`/api/comments...`)
- Flags & appeals: create flag, list flags (admin), update flag, appeal (`/api/flags...`)
- Uploads: `POST /api/upload/video` (Supabase direct upload)

Protected routes expect `Authorization: Bearer <token>`.



## Demo Login Accounts

### Admin Account
- **Email:** admin@nottube.com  
- **Password:** password  

### User Accounts (Both Users Share the Same Password)
- **Email:** y@kfupm.edu.sa  
- **Email:** ya@kfupm.edu.sa  
- **Password for both:** Aa$123


