# NotTube

React (Vite) front end + Node/Express + MongoDB backend with JWT auth.

## Stack
- Front end: React 19 + Vite, hash-based routing, fetch to REST APIs.
- Back end: Node.js, Express, MongoDB (Mongoose), JWT auth, Zod validation.

## Setup
1) Install dependencies
```
cd backend
npm install

cd ../nottube
npm install
```

2) Create `backend/.env` (do not commit secrets). Example:
```
PORT=4000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=super-secret-change-me
CLIENT_ORIGIN=http://localhost:5173
ADMIN_EMAILS=admin@nottube.com
```

3) Run the servers (two terminals):
```
cd backend
npm run dev

cd nottube
npm run dev
```
Front end runs at `http://localhost:5173`, API at `http://localhost:4000/api`.

## API quick reference
Authorization header: `Authorization: Bearer <token>` for protected routes.

### Auth
- `POST /api/auth/signup` `{ email, password, name? }` → `{ token, user }`
- `POST /api/auth/login` `{ email, password }` → `{ token, user }`
- `GET /api/auth/me` → `{ user }`
- `PUT /api/auth/profile` `{ name }` → `{ user }`
- `POST /api/auth/subscriptions/toggle` `{ channel }` → `{ subscribed, subscriptions }`

### Videos
- `GET /api/videos?search=term` → `{ videos }`
- `GET /api/videos/mine` (auth) → `{ videos }`
- `POST /api/videos` (auth) `{ title, description, src, length }` → `{ video }`
- `GET /api/videos/:id` → `{ video }`
- `PUT /api/videos/:id` (owner/admin) `{ ...fields }`
- `DELETE /api/videos/:id` (owner/admin)
- `POST /api/videos/:id/like` (auth) → `{ liked, likesCount }`
- `POST /api/videos/:id/save` (auth) → `{ saved }`
- `POST /api/videos/:id/watch` (auth) → `{ watched, views }`

### Comments
- `GET /api/comments/video/:videoId` → `{ comments }`
- `POST /api/comments/video/:videoId` (auth) `{ text }` → `{ comment }`
- `DELETE /api/comments/:id` (owner/admin)

### Flags / appeals
- `POST /api/flags` (auth) `{ type: video|account|comment, targetId, reason, message? }` → `{ flag }`
- `GET /api/flags` (admin) → `{ flags }`
- `PATCH /api/flags/:id` (admin) `{ status?, resolution? }` → `{ flag }`

## cURL smoke tests
Signup/login:
```
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password","name":"User"}'
```

Create a video (requires token):
```
TOKEN=your-token-here
curl -X POST http://localhost:4000/api/videos \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Demo","src":"https://example.com/file.mp4","length":"3:00","description":"Test"}'
```

List videos:
```
curl http://localhost:4000/api/videos
```

## Front-end notes
- Uses the REST API for auth, videos, likes/saves/watched, comments, and subscriptions.
- Upload flow expects a direct, publicly reachable MP4 URL (no file storage on this server).
- Hash routing (`#/...`) keeps it SPA-only; adjust `VITE_API_URL` if you host the API elsewhere.
