import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { Stock } from './stockModel.js';
import User from './User.js';

export const StockRequest = sequelize.define('StockRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  franchise_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  stockholder_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Stock,
      key: 'id',
    },
  },
  requested_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'stock_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

StockRequest.belongsTo(Stock, { foreignKey: 'stock_id', as: 'stock' });
StockRequest.belongsTo(User, { foreignKey: 'franchise_id', as: 'franchise' });
StockRequest.belongsTo(User, { foreignKey: 'stockholder_id', as: 'stockholder' });