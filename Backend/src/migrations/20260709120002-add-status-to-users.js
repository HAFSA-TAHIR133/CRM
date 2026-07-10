export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Users', 'status', {
    type: Sequelize.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
    allowNull: false
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Users', 'status');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_status";');
};
