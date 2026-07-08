'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Note.belongsTo(models.Lead, { foreignKey: 'leadId', as: 'lead' });
      Note.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });
      Note.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    }
  }

  Note.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      content: { type: DataTypes.TEXT, allowNull: false },
      leadId: { type: DataTypes.INTEGER, allowNull: true },
      taskId: { type: DataTypes.INTEGER, allowNull: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: false }
    }, 
    {
      sequelize,
      modelName: 'Note',
      timestamps: true
    }
  );

  return Note;
};
