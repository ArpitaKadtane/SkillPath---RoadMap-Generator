import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'https://skillpath.onrender.com',
  /\.onrender\.com$/,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.some((o) =>
          o instanceof RegExp ? o.test(origin) : o === origin
        )
      ) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SkillPath API is running',
    docs: '/api/health',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/roadmaps', roadmapRoutes);

export default app;
