import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ensure path points to your Sequelize file

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

export const StockModel = {
  // Fetch all stocks
  async getAll() {
    return await Stock.findAll({
      order: [['created_at', 'DESC']],
    });
  },

  // Fetch single stock by ID
  async getById(id) {
    return await Stock.findByPk(id);
  },

  // Insert a new stock entry
  async create({ stockName, singleStockWeight, count }) {
    return await Stock.create({
      stock_name: stockName,
      single_stock_weight: singleStockWeight,
      count: count,
    });
  },

  // Update existing stock entry
  async updateById(id, { stockName, singleStockWeight, count }) {
    const stock = await Stock.findByPk(id);
    if (!stock) return null;

    return await stock.update({
      stock_name: stockName,
      single_stock_weight: singleStockWeight,
      count: count,
    });
  },

  // Delete stock entry
  async deleteById(id) {
    const stock = await Stock.findByPk(id);
    if (!stock) return null;

    await stock.destroy();
    return stock;
  },
};