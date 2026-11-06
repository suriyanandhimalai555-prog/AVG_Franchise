import sequelize from '../config/db.js';
import User from './User.js';
import { Stock } from './stockModel.js';
// import { StockRequest } from './stockRequestModel.js';
import Attendance from './attendanceModel.js';
import AppSetting from './AppSetting.js';
import WhatsappMessage from './whatsappMessage.js'; // <-- 1. Import the WhatsApp model

const initDB = async () => {
  try {
    await sequelize.authenticate();
    // alter: true will now automatically create the "WhatsappMessages" table in production
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
  WhatsappMessage, // <-- 2. Export it so it registers with Sequelize
  initDB 
};