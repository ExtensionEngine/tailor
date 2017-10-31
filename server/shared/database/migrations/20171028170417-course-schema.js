module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('course', 'schema', {
      type: Sequelize.STRING
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('course', 'schema');
  }
};
