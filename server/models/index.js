import sequelize from '../config/db.js';
import User from './User.js';

const initDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('PostgreSQL Database Connected & Synced.');
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
};

export { sequelize, User, initDB };