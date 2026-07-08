export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("Leads", {
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
      contactInfo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      leadSource: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expectedValue: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0.00
      },
      status: {
        type: Sequelize.ENUM('open', 'closed'),
        defaultValue: 'open'
      },
      outcome: {
        type: Sequelize.ENUM('win', 'lose'),
        allowNull: true
      },
      assignedTo: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      pipelineId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pipelines',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      stageId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Stages',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
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

    // Indexes for performance (very important for Kanban queries)
    await queryInterface.addIndex('Leads', ['assignedTo']);
    await queryInterface.addIndex('Leads', ['pipelineId']);
    await queryInterface.addIndex('Leads', ['stageId']);
    await queryInterface.addIndex('Leads', ['status']);
  };

  export const down = async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Leads');
  };