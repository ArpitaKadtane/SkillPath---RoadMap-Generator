# SkillPath

SkillPath is an AI-powered learning roadmap generator.

## Project Structure

```txt
SkillPath/
├── client/   # React + Vite frontend
└── server/   # Node.js + Express backend
```

## Local Development

Install dependencies in both apps:

```bash
cd client
npm install

cd ../server
npm install
```

Run the frontend:

```bash
cd client
npm run dev
```

Run the backend:

```bash
cd server
npm run dev
```

## Phase 2: Authentication

The backend now includes:

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Before testing auth, create `server/.env` from `server/.env.example`, add your PostgreSQL `DATABASE_URL`, then run:

```bash
cd server
npm run prisma:migrate
```

The frontend stores the JWT in `localStorage` and protects the dashboard route.
