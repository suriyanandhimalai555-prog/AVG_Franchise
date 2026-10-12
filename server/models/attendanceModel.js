import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Attendance = sequelize.define(
  'Attendance',
  {
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
    check_in_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    check_in_lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    check_in_location: {
      type: DataTypes.STRING(255),
      allowNull: true,
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

Attendance.belongsTo(User, { foreignKey: 'franchise_id', as: 'franchise' });
User.hasMany(Attendance, { foreignKey: 'franchise_id', as: 'attendances' });

export default Attendance;