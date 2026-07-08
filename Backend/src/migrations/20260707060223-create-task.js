'use strict';
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("Tasks", {
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
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'overdue'),
        defaultValue: 'pending'
      },
      assignedTo: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      leadId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Leads',
          key: 'id'
        },
        onDelete: 'CASCADE'
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

    await queryInterface.addIndex('Tasks', ['assignedTo']);
    await queryInterface.addIndex('Tasks', ['leadId']);
    await queryInterface.addIndex('Tasks', ['status']);
    await queryInterface.addIndex('Tasks', ['dueDate']);
  };

export const down = async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tasks');
  };