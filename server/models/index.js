import sequelize from '../config/db.js';
import User from './User.js';
import { Stock } from './stockModel.js';

const initDB = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('PostgreSQL Database Connected Successfully.');

    // Sync all models (User, Stock, etc.) with PostgreSQL schema
    await sequelize.sync({ alter: true });
    console.log('PostgreSQL Database & Models Synced.');
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
};

export { sequelize, User, Stock, initDB };