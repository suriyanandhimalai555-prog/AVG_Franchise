import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { Stock } from './stockModel.js';

export const StockRequest = sequelize.define('StockRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  franchise_name: {
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

// Setup Association
StockRequest.belongsTo(Stock, { foreignKey: 'stock_id', as: 'stock' });
Stock.hasMany(StockRequest, { foreignKey: 'stock_id' });