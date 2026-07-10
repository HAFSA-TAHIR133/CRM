'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Stage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Stage.belongsTo(models.Pipeline, { foreignKey: 'pipelineId', as: 'pipeline' });
      Stage.hasMany(models.Lead, { foreignKey: 'stageId', as: 'leads' });
    }
  }

  Stage.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      pipelineId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      order: { type: DataTypes.INTEGER, defaultValue: 0 },
      color: { type: DataTypes.STRING, defaultValue: '#3b82f6' }
    }, 
    {
      sequelize,
      modelName: 'Stage',
      timestamps: true
    }
  );

  return Stage;
};
