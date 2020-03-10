'use strict';
const { User, Repository, Revision, Activity } = require('../database');
const { Sequelize } = require('../database');
const { Op } = require('sequelize');
const { subDays } = require('date-fns');
const { sendActivityDigest } = require('../mail');
const { format } = require('date-fns');
const mapKeys = require('lodash/mapKeys');
const inspect = require('util').inspect;

async function processRepositoryRevisions() {
  const groupedData = groupByUsersAndRepositories(
    await getUsersWithRepositoriesAndRevisions()
  );

  console.log(inspect(groupedData, false, null, true));
}

module.exports = processRepositoryRevisions;

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
            attributes: ['entity', 'operation', 'created_at', 'state'],
            where: {
              createdAt: { [Op.gte]: subDays(new Date(), 10) }
            }
          }
        ]
      }
    ]
  });
}

function formatRevision(revision) {
  const { entity, operation, state } = revision;
  return {
    entity,
    operation,
    createdAt: revision.get({ plain: true }).created_at,
    type: state.type
  };
}

function formatRepository(repo) {
  const { name, revisions, repositoryUser, data, schema } = repo;
  return {
    revisions: revisions.map(revision => formatRevision(revision)),
    color: data.color,
    name,
    schema,
    userAddedToRepository: repositoryUser.createdAt,
    createdAt: repo.get({ plain: true }).created_at
  };
}

function hasProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
