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

  // console.log(inspect(groupedData, false, null, true));
}

function groupByUsersAndRepositories(users) {
  console.log(inspect(users, false, 3, true));
  return users.reduce((result, user) => {
    const { email } = user;
    const formatRevision = revision => ({
      entity: revision['repositories.revisions.entity'],
      operation: revision['repositories.revisions.operation'],
      createdAt: revision['repositories.revisions.created_at'],
      type: revision['repositories.revisions.state'].type
    });
    const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    const formatRepository = repository => ({
      revisions: [formatRevision(repository)],
      color: repository['repositories.data'].color,
      name: repository['repositories.name'],
      createdAt: repository['repositories.created_at'],
      userAddedToRepository: repository['repositories.repositoryUser.createdAt']
    });

    if (!hasProp(result, email)) {
      result[email] = {
        [user['repositories.name']]: formatRepository(user)
      };
      return result;
    }
    if (hasProp(result[email], user['repositories.name'])) {
      result[email][user['repositories.name']].revisions.push(formatRevision(user));
      return result;
    }
    result[email][user['repositories.name']] = formatRepository(user);
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
        attributes: ['name', 'data', 'created_at'],
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

module.exports = processRepositoryRevisions;
