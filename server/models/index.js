// models/index.js
import sequelize from '../config/db.js';
import User from './User.js';
import { Stock } from './stockModel.js';
import { StockRequest } from './stockRequestModel.js';
import Attendance from './attendanceModel.js';
import AppSetting from './AppSetting.js';

const initDB = async () => {
  try {
    await sequelize.authenticate();
    
    // sync() without parameters or with explicit model creation 
    // prevents crashing on existing tables with strict column additions
    await sequelize.sync({ alter: { drop: false } });
    
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
  AppSetting, 
  initDB 
};