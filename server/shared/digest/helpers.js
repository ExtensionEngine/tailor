'use strict';
const { User, RepositoryUser } = require('../database');
const { Sequelize } = require('../database');
const { Op } = require('sequelize');
const { subDays } = require('date-fns');

const getUsersThatLoggedIn = () => {
  return User.findAll({
    attributes: ['id', 'email'],
    where: { created_at: { [Op.ne]: Sequelize.col('user.updated_at') } }
  });
};

const filterRecentlyAddedRepositories = user => {
  return user.getRepositories({
    include: [{
      model: RepositoryUser,
      attributes: ['created_at'],
      where: { created_at: { [Op.lte]: subDays(new Date(), 3, new Date()) } }
    }]
  });
};

const getRevisionsSinceDate = (date, repo) => {
  return repo.getRevisions({
    where: { created_at: { [Op.lte]: date } },
    raw: true
  });
};

module.exports = {
  getUsersThatLoggedIn,
  getRevisionsSinceDate,
  filterRecentlyAddedRepositories
};
