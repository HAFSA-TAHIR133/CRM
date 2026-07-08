'use strict';
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("Users", {
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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'user'),
        defaultValue: 'user'
      },
      avatar: {
        type: Sequelize.STRING,
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

    // Indexes
    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Users', ['role']);
  };

  export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable("Users");

  // Remove ENUM type in PostgreSQL
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_Users_role";'
  );
};