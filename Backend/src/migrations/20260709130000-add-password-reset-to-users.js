export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Users', 'resetToken', {
    type: Sequelize.STRING,
    allowNull: true
  });
  await queryInterface.addColumn('Users', 'resetTokenExpiry', {
    type: Sequelize.DATE,
    allowNull: true
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('Users', 'resetToken');
  await queryInterface.removeColumn('Users', 'resetTokenExpiry');
};
