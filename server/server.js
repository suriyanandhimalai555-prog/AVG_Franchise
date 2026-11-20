import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import stockRequestRoutes from './routes/stockRequestRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import dailyReportRoutes from './routes/dailyReportRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import appSettingRoutes from './routes/appSettingRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

dotenv.config();

const app = express();

const normalizeOrigin = (url = '') =>
  url
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\/+$/, '');

const rawOrigins = [
  'https://avgfranchise.com',
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []),
];

const allowedOrigins = new Set(
  rawOrigins.map(normalizeOrigin).filter(Boolean)
);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (like curl, health checks, server-to-server) with no Origin header
    if (!origin) {
      return callback(null, true);
    }

    const cleanedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.has(cleanedOrigin)) {
      return callback(null, true);
    }

    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS before body parsers and routes
app.use(cors(corsOptions));

// Express 5 compatible preflight handler
app.options('/{*splat}', cors(corsOptions));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stock-requests', stockRequestRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/daily-reports', dailyReportRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/app-settings', appSettingRoutes);
app.use('/api/leads', leadRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = Number(process.env.PORT) || 8080;

const startServer = async () => {
  try {
    await initDB();
  } catch (err) {
    console.error('Database sync error:', err.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Allowed CORS origins:', [...allowedOrigins]);
  });
};

startServer();