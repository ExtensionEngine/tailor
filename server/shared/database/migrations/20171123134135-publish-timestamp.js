module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('activity', 'published_at', {
      type: Sequelize.DATE
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('activity', 'published_at');
  }
};
