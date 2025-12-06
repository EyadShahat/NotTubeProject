NotTube
React (Vite) front end + Node/Express + MongoDB backend with JWT auth.
Stack
Front end: React 19 + Vite, hash-based routing, fetch to REST APIs.
Back end: Node.js, Express, MongoDB (Mongoose), JWT auth, Zod validation.
Setup
1) Install dependencies
cd backend
npm install

cd ../nottube
npm install
2) Create backend/.env (do not commit secrets)
Example:
PORT=4000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=super-secret-change-me
CLIENT_ORIGIN=http://localhost:5173
ADMIN_EMAILS=admin@nottube.com
3) Run the servers (two terminals)
cd backend
npm run dev

cd nottube
npm run dev
Front end: http://localhost:5173
API: http://localhost:4000/api
Demo Login Accounts
Admin Account
Email: admin@nottube.com
Password: password
User Accounts (Both Users Share the Same Password)
Email: y@kfupm.edu.sa
Email: ya@kfupm.edu.sa
Password for both: Aa$123
API Quick Reference
Authorization header:
Authorization: Bearer <token>
Auth
POST /api/auth/signup → { token, user }
POST /api/auth/login → { token, user }
GET /api/auth/me → { user }
PUT /api/auth/profile → { user }
POST /api/auth/subscriptions/toggle → { subscribed, subscriptions }
Videos
GET /api/videos?search=term
GET /api/videos/mine (auth)
POST /api/videos (auth)
GET /api/videos/:id
PUT /api/videos/:id (owner/admin)
DELETE /api/videos/:id (owner/admin)
POST /api/videos/:id/like
POST /api/videos/:id/save
POST /api/videos/:id/watch
Comments
GET /api/comments/video/:videoId
POST /api/comments/video/:videoId
DELETE /api/comments/:id (owner/admin)
Flags / Appeals
POST /api/flags
GET /api/flags (admin)
PATCH /api/flags/:id (admin)
cURL Smoke Tests
Signup
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password","name":"User"}'
Create a Video (requires token)
TOKEN=your-token-here
curl -X POST http://localhost:4000/api/videos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Demo","src":"https://example.com/file.mp4","length":"3:00","description":"Test"}'
List Videos
curl http://localhost:4000/api/videos
Front-End Notes
Uses REST API for auth, videos, likes/saves/watched, comments, and subscriptions.
Upload requires a direct, publicly reachable MP4 URL (server does not store files).
Hash routing (#/...) keeps it purely SPA-based.
Update VITE_API_URL if deploying with a remote backend.
