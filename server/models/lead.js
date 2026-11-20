import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  leadSource: {
    type: DataTypes.STRING,
    defaultValue: 'WhatsApp / Manual',
  },
  formId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  campaignName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rawFields: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default Lead;