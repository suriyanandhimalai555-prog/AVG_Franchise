import sequelize from '../config/db.js';
import User from './User.js';
import { Stock } from './stockModel.js';
// import { StockRequest } from './stockRequestModel.js';
import Attendance from './attendanceModel.js';
import AppSetting from './AppSetting.js';
import WhatsappMessage from './whatsappMessage.js';
import Lead from './lead.js'; // <-- 1. Import the Lead model

const initDB = async () => {
  try {
    await sequelize.authenticate();
    // alter: true will automatically create the "Leads" and "WhatsappMessages" tables in PostgreSQL
    await sequelize.sync({ alter: true });
    console.log('PostgreSQL Database & Models Synced.');
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
};

export { 
  sequelize, 
  User, 
  Stock, 
  // StockRequest, 
  Attendance, 
  AppSetting, 
  WhatsappMessage, 
  Lead, // <-- 2. Export it so it registers with Sequelize
  initDB 
};