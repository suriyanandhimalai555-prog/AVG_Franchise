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

// Middlewares
app.use(cors());
app.use(express.json());

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

// Database connection & Auto-sync tables
initDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});