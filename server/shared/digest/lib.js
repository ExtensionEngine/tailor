'use strict';

const { getSchema } = require('../../../config/shared/activities');
const { Op } = require('sequelize');
const { User, Repository, Revision } = require('../database');
const { sendActivityDigest } = require('../mail');
const { Sequelize } = require('../database');
const { subDays } = require('date-fns');
const cloneDeep = require('lodash/cloneDeep');
const mapValues = require('lodash/mapValues');

async function processRepositoryRevisions() {
  const groupedData = groupByUsersAndRepositories(
    await getUsersWithRepositoriesAndRevisions()
  );
  const validRepos = filterNewRepos(groupedData);

  // sendActivityDigest(filterRevisions(validRepos));
}

module.exports = processRepositoryRevisions;

function filterNewRepos(groupedUsers) {
  return mapValues(groupedUsers, (userRepositories, userEmail) => {
    return userRepositories.filter(repo => {
      if (repo.userAddedToRepository > subDays(new Date(), 3)) {
        return false;
      }
      return true;
    });
  });
}

function filterRevisions(repos) {
  const clonedRepos = cloneDeep(repos);
  mapValues(repos, (repositories, userEmail) => {
    repositories.forEach((repo, i) => {
      if (repo.userAddedToRepository < subDays(new Date(), 10)) {
        clonedRepos[userEmail][i].revisions = filterRevisionsSinceDate(repo.revisions, subDays(new Date(), 7));
        return;
      }
      clonedRepos[userEmail][i].revisions = filterRevisionsSinceDate(repo.revisions, repo.userAddedToRepository);
    });
  });
  return clonedRepos;
}

function filterRevisionsSinceDate(revisions, date) {
  return revisions.filter(revision => revision.createdAt > date);
}

function groupByUsersAndRepositories(users) {
  return users.reduce((result, user) => {
    const { email } = user;
    result[email] = user.repositories.map(repo => formatRepository(repo));
    return result;
  }, {});
}
function getUsersWithRepositoriesAndRevisions() {
  return User.findAll({
    attributes: ['email'],
    where: { created_at: { [Op.ne]: Sequelize.col('user.updated_at') } },
    include: [
      {
        model: Repository,
        attributes: ['name', 'data', 'created_at', 'schema'],
        include: [
          {
            model: Revision,
            attributes: ['entity', 'operation', 'created_at', 'state', 'id'],
            where: {
              createdAt: { [Op.gte]: subDays(new Date(), 10) }
            }
          }
        ]
      }
    ]
  });
}

function formatRevision(revision, schema) {
  const { entity, operation, state, id } = revision;
  return {
    id,
    entity,
    operation,
    createdAt: revision.get({ plain: true }).created_at,
    type: state.type,
    color: getActivityColor(schema, state.type)
  };
}
function formatRepository(repo) {
  const { name, revisions, repositoryUser, data, schema } = repo;
  return {
    revisions: revisions.map(revision => formatRevision(revision, schema)),
    color: data.color,
    name,
    schema,
    userAddedToRepository: repositoryUser.createdAt,
    createdAt: repo.get({ plain: true }).created_at
  };
}

function getActivityColor(schema, type) {
  const element = getSchema(schema).structure.find(element => element.type === type);
  return element ? element.color : '#fefefe';
}
