import { DataTypes } from 'sequelize';
import { sequelize } from './index.js'; // Adjust path to your main db instance if necessary

const WhatsappMessage = sequelize.define('WhatsappMessage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Customer',
  },
  direction: {
    type: DataTypes.ENUM('inbound', 'outbound'),
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,
});

export default WhatsappMessage;