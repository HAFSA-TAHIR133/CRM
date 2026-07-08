export const up = async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Attachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fileUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fileName: {
        type: Sequelize.STRING,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Attachments', ['leadId']);
    await queryInterface.addIndex('Attachments', ['taskId']);
  };

  export const down = async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Attachments');
  };