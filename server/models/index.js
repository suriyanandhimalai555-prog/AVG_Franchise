// models/index.js
import sequelize from '../config/db.js';
import User from './User.js';
import { Stock } from './stockModel.js';
import { StockRequest } from './stockRequestModel.js';
import Attendance from './attendanceModel.js';
import AppSetting from './AppSetting.js'; // <-- 1. Import your AppSetting model

const initDB = async () => {
  try {
    await sequelize.authenticate();
    // alter: true will now automatically create the "app_settings" table in production
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
  StockRequest, 
  Attendance, 
  AppSetting, // <-- 2. Export AppSetting so controllers can reference it safely
  initDB 
};