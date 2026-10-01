import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Attendance = sequelize.define(
  'Attendance',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    franchise_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    check_in_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    check_out_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'ACTIVE', // 'ACTIVE' or 'COMPLETED'
    },
  },
  {
    tableName: 'attendance',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        name: 'idx_franchise_status',
        fields: ['franchise_id', 'status'],
      },
    ],
  }
);

export default Attendance;