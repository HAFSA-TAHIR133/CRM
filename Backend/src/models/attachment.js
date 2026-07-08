'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attachment.belongsTo(models.Lead, { foreignKey: 'leadId', as: 'lead' });
      Attachment.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });
    }
  }

  Attachment.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fileUrl: { type: DataTypes.STRING, allowNull: false },
      fileName: { type: DataTypes.STRING },
      leadId: { type: DataTypes.INTEGER, allowNull: true },
      taskId: { type: DataTypes.INTEGER, allowNull: true }
    }, 
    {
      sequelize,
      modelName: 'Attachment',
      timestamps: true
    }
  );

  return Attachment;
};
