export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Settings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    systemName: {
      type: Sequelize.STRING,
      defaultValue: 'Enterprise CRM Platform'
    },
    allowRegistration: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    maintenanceMode: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    notificationEmail: {
      type: Sequelize.STRING,
      defaultValue: 'alerts@system.com'
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
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('Settings');
};
