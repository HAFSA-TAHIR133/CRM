export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Sessions', 'refreshToken', {
    type: Sequelize.TEXT,
    allowNull: true
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Sessions', 'refreshToken');
};
