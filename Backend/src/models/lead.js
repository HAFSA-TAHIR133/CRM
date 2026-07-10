'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Lead extends Model {
    static associate(models) {
      Lead.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assignedUser' });
      Lead.belongsTo(models.Pipeline, { foreignKey: 'pipelineId', as: 'pipeline' });
      Lead.belongsTo(models.Stage, { foreignKey: 'stageId', as: 'stage' });
      Lead.hasMany(models.Task, { foreignKey: 'leadId', as: 'tasks' });
      Lead.hasMany(models.Note, { foreignKey: 'leadId', as: 'notes' });
      Lead.hasMany(models.Attachment, { foreignKey: 'leadId', as: 'attachments' });
    }
  }

  Lead.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      contactInfo: { type: DataTypes.STRING },
      leadSource: { type: DataTypes.STRING },
      expectedValue: { type: DataTypes.DECIMAL(10, 2) },
      status: {
        type: DataTypes.ENUM('open', 'closed'),
        defaultValue: 'open'
      },
      outcome: { type: DataTypes.ENUM('won', 'lost'), allowNull: true },
      assignedTo: { type: DataTypes.INTEGER, allowNull: true },
      pipelineId: { type: DataTypes.INTEGER, allowNull: true },
      stageId: { type: DataTypes.INTEGER, allowNull: true }
    }, 
    {
      sequelize,
      modelName: 'Lead',
      timestamps: true
    }
  );

  return Lead;
};