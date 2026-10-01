// models/index.js
import sequelize from '../config/db.js';
import User from './User.js';
import { Stock } from './stockModel.js';
import { StockRequest } from './stockRequestModel.js';

const initDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('PostgreSQL Database & Models Synced.');
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
};

export { sequelize, User, Stock, StockRequest, initDB };