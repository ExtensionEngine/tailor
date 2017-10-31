module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('course', 'data', {
      type: Sequelize.JSON,
      defaultValue: {}
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('course', 'data');
  }
};
