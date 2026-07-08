'use strict';
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("Pipelines", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Pipelines', ['name']);
  };

  export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('Pipelines');
  };