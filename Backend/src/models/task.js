'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assignedUser' });
      Task.belongsTo(models.Lead, { foreignKey: 'leadId', as: 'lead' });
      Task.hasMany(models.Note, { foreignKey: 'taskId', as: 'notes' });
      Task.hasMany(models.Attachment, { foreignKey: 'taskId', as: 'attachments' });
    }
  }

  Task.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      dueDate: { type: DataTypes.DATE },
      priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' },
      status: { type: DataTypes.ENUM('pending', 'completed', 'overdue'), defaultValue: 'pending' },
      assignedTo: { type: DataTypes.INTEGER, allowNull: true },
      leadId: { type: DataTypes.INTEGER, allowNull: true }
    }, 
    {
      sequelize,
      modelName: 'Task',
      timestamps: true
    }
  );

  return Task;
};
