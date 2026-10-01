import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ticket_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  franchise_id: {
    type: DataTypes.STRING, // Updated from INTEGER to STRING to support UUIDs
    allowNull: false,
  },
  franchise_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    defaultValue: 'MEDIUM',
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'FORWARDED', 'CLOSED'),
    defaultValue: 'OPEN',
  },
  current_level: {
    type: DataTypes.ENUM(
      'SALES_MANAGER',
      'STATE_HEAD',
      'HEAD_COORDINATOR',
      'DIRECTOR',
      'ADMIN',
      'SUPER_ADMIN'
    ),
    defaultValue: 'SALES_MANAGER',
  },
  resolution_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default Ticket;