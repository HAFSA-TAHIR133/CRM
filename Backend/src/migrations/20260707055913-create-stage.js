export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("Stages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pipelineId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pipelines',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      color: {
        type: Sequelize.STRING,
        defaultValue: '#3b82f6'
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

    await queryInterface.addIndex('Stages', ['pipelineId']);
    await queryInterface.addIndex('Stages', ['order']);
  };
  
export const down = async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Stages');
  };