'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Setting extends Model {}

  Setting.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      systemName: { type: DataTypes.STRING, defaultValue: 'Enterprise CRM Platform' },
      allowRegistration: { type: DataTypes.BOOLEAN, defaultValue: false },
      maintenanceMode: { type: DataTypes.BOOLEAN, defaultValue: false },
      notificationEmail: { type: DataTypes.STRING, defaultValue: 'alerts@system.com' }
    },
    {
      sequelize,
      modelName: 'Setting',
      tableName: 'Settings',
      timestamps: true
    }
  );

  return Setting;
};
