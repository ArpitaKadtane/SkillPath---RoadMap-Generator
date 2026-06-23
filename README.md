# SkillPath---RoadMap-Generator
# SkillPath Project Context

Project Name: SkillPath

Description:
SkillPath is an AI-powered learning roadmap platform that generates personalized learning paths based on a user's career goal, current skill level, available study time, and target completion date.

Goal:
This project is being built primarily for learning full-stack development and deployment while creating a professional resume-worthy SaaS application.

Current Tech Stack:

Frontend:

* React
* Vite
* JavaScript
* Tailwind CSS
* React Router
* Axios

Backend:

* Node.js
* Express.js

Database:

* PostgreSQL
* Prisma ORM

Authentication:

* JWT Authentication

AI:

* Google Gemini API

Deployment:

* Frontend: Vercel
* Backend: Render
* Database: Neon PostgreSQL

UI Style:

* Modern SaaS Dashboard
* Inspired by Notion, Linear, and Coursera
* Indigo primary color
* Responsive design
* Dark/Light mode
* Clean and professional

Current Frontend Pages:

Public:

* Home (Landing Page)
* Login
* Register

Protected:

* Dashboard
* Profile Setup
* Create Roadmap
* My Roadmaps
* Progress Tracking
* Settings

Current Development Status:

* Project setup completed
* Authentication UI completed
* Main frontend pages created
* Working on frontend polish before backend integration

Main Features:

MVP:

1. User Authentication
2. User Profile Setup
3. AI Roadmap Generation
4. Save Roadmaps
5. Progress Tracking
6. Dashboard
7. Project Recommendations

Future Features:

* Skill Gap Analysis
* Resume Upload
* AI Mentor Chat
* Weekly Study Planner

Important Instructions:

* Keep architecture beginner-to-intermediate friendly.
* Avoid over-engineering.
* Avoid microservices.
* Avoid enterprise-level complexity.
* Prefer simple and scalable solutions.
* Explain code changes before implementing.
* Follow React and Express best practices.
* Focus on learning and maintainability.

When suggesting code:

* Reuse existing components when possible.
* Keep folder structure simple.
* Do not rewrite unrelated files.
* Only modify what is necessary.

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
