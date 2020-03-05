'use strict';
const { User, RepositoryUser } = require('../database');
const { Sequelize } = require('../database');
const { Op } = require('sequelize');
const { subDays } = require('date-fns');
const inspect = require('util').inspect;

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
      where: {
        user_id: user.dataValues.id,
        created_at: { [Op.lte]: subDays(new Date(), 3) }
      }
    }]
  });
};

const getRevisionsSinceDate = async (date, repo) => {
  // not sure if working properly
  return {
    revisions: await repo.getRevisions({
      where: { created_at: { [Op.gte]: date } },
      raw: true
    }),
    ...repo.dataValues
  };
};

async function getRevisions() {
  const users = await getUsersThatLoggedIn();
  users.map(async user => {
    const repos = await filterRecentlyAddedRepositories(user);
    const revisions = await Promise.all(repos.map(async repo => {
      return (repo.repositoryUser.dataValues.createdAt < subDays(new Date(), 10))
        ? getRevisionsSinceDate(subDays(new Date(), 7), repo)
        : getRevisionsSinceDate(repo.repositoryUser.dataValues.createdAt, repo);
    }));

    const usersAndRevisions = {
      user: user.dataValues.email,
      repositories: revisions
    };

    console.log(inspect(usersAndRevisions, false, 4, true));
  });
}

module.exports = {
  getUsersThatLoggedIn,
  getRevisionsSinceDate,
  filterRecentlyAddedRepositories,
  getRevisions
};
