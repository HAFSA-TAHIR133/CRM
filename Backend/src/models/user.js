'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Lead, { foreignKey: 'assignedTo', as: 'assignedLeads' });
      User.hasMany(models.Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
      User.hasMany(models.Session, {  foreignKey: 'userId', as: 'sessions' });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { 
        type: DataTypes.ENUM('admin', 'user'), 
        defaultValue: 'user' 
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
      },
      avatar: { type: DataTypes.STRING },
      resetToken: { type: DataTypes.STRING, allowNull: true },
      resetTokenExpiry: { type: DataTypes.DATE, allowNull: true }
    }, 
    {
      sequelize,
      modelName: 'User',
      timestamps: true
    }
  );

  return User;
};
