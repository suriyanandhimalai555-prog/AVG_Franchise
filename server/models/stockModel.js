import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

export const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stock_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  single_stock_weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Headquarters', // Provides default value so PostgreSQL ALTER TABLE succeeds for existing rows
  },
  stockholder_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  total_weight: {
    type: DataTypes.VIRTUAL,
    get() {
      const weight = parseFloat(this.getDataValue('single_stock_weight')) || 0;
      const count = parseInt(this.getDataValue('count'), 10) || 0;
      return (weight * count).toFixed(2);
    },
    set() {
      throw new Error('Do not try to set `total_weight` directly!');
    },
  },
}, {
  tableName: 'stocks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Stock.belongsTo(User, { foreignKey: 'stockholder_id', as: 'stockholder' });

export const StockModel = {
  // Fetch stocks filtered by user role and district
  async getAll(user) {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      return await Stock.findAll({
        include: [{ model: User, as: 'stockholder', attributes: ['id', 'name', 'district', 'state'] }],
        order: [['created_at', 'DESC']],
      });
    }

    // Stockholders only see inventory in their district
    return await Stock.findAll({
      where: { district: user.district },
      include: [{ model: User, as: 'stockholder', attributes: ['id', 'name', 'district', 'state'] }],
      order: [['created_at', 'DESC']],
    });
  },

  async getById(id) {
    return await Stock.findByPk(id);
  },

  async upsert({ stockName, singleStockWeight, count, district, stockholderId }) {
    const existingStock = await Stock.findOne({
      where: { stock_name: stockName, district: district },
    });

    if (existingStock) {
      return await existingStock.update({
        single_stock_weight: singleStockWeight,
        count: count,
        stockholder_id: stockholderId || existingStock.stockholder_id,
      });
    }

    return await Stock.create({
      stock_name: stockName,
      single_stock_weight: singleStockWeight,
      count: count,
      district: district,
      stockholder_id: stockholderId,
    });
  },
};