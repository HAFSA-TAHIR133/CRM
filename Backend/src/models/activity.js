'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      // Associates the log with the person who performed the action
      Activity.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      // Associates the log with the specific lead
      Activity.belongsTo(models.Lead, { foreignKey: 'leadId', as: 'lead' });
    }
  }

  Activity.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      leadId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: true }, // null if system-generated
      action: { type: DataTypes.STRING, allowNull: false }, // e.g., "Lead Status Updated"
      description: { type: DataTypes.TEXT, allowNull: true } // e.g., "Changed from 'Contacted' to 'Qualified'"
    },
    {
      sequelize,
      modelName: 'Activity',
      tableName: 'Activities',
      timestamps: true, // Auto-generates the required createdAt timestamp field
    }
  );

  return Activity;
};