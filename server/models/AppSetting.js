import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Adjust path if your database connection file differs

const AppSetting = sequelize.define('AppSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  androidCurrent: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1.0.0',
  },
  androidMinimum: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1.0.0',
  },
  iosCurrent: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1.0.0',
  },
  iosMinimum: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1.0.0',
  },
  releaseNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  forceUpdate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'app_settings',
  timestamps: true,
});

export default AppSetting;