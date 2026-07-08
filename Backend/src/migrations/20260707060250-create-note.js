export const up = async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      leadId: {
        type: Sequelize.INTEGER,
        references: { model: 'Leads', key: 'id' },
        onDelete: 'CASCADE'
      },
      taskId: {
        type: Sequelize.INTEGER,
        references: { model: 'Tasks', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
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

    await queryInterface.addIndex('Notes', ['leadId']);
    await queryInterface.addIndex('Notes', ['taskId']);
  };

  export const down = async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Notes');
  };