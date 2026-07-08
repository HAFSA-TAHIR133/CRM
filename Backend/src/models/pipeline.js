'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Pipeline extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pipeline.hasMany(models.Stage, { foreignKey: 'pipelineId', as: 'stages' });
      Pipeline.hasMany(models.Lead, { foreignKey: 'pipelineId', as: 'leads' });
    }
  }

  Pipeline.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT }
    }, 
    {
      sequelize,
      modelName: 'Pipeline',
      timestamps: true
    }
  );

  return Pipeline;
};
