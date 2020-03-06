'use strict';
const { User, RepositoryUser } = require('../database');
const { Sequelize } = require('../database');
const { Op } = require('sequelize');
const { subDays } = require('date-fns');
const { sendActivityDigest } = require('../mail');
const { format } = require('date-fns');
const groupArray = require('group-array');
const mapKeys = require('lodash/mapKeys');

const getUsersThatLoggedIn = () => {
  return User.findAll({
    attributes: ['id', 'email'],
    where: { created_at: { [Op.ne]: Sequelize.col('user.updated_at') } }
  });
};

const filterRecentlyAddedRepositories = user => {
  return user.getRepositories({
    attributes: ['id', 'data', 'name', 'createdAt'],
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
  return {
    revisions: await repo.getRevisions({
      attributes: ['entity', 'operation', 'state'],
      where: { created_at: { [Op.gte]: date } },
      raw: true
    }),
    ...repo.get({ plain: true })
  };
};

const formatRevisions = revisions => {
  return revisions.map(revision => {
    return {
      repo: revision.name,
      color: revision.data.color,
      createdAt: format(revision.createdAt, 'dd-MM-yyyy'),
      revisions: revision.revisions
    };
  });
};

async function processRepositoryRevisions() {
  const users = await getUsersThatLoggedIn();
  users.map(async user => {
    const repos = await filterRecentlyAddedRepositories(user);
    const revisions = await Promise.all(repos.map(async repo => {
      return (repo.repositoryUser.dataValues.createdAt < subDays(new Date(), 10))
        ? getRevisionsSinceDate(subDays(new Date(), 7), repo)
        : getRevisionsSinceDate(repo.repositoryUser.dataValues.createdAt, repo);
    }));
    const formattedRevisions = formatRevisions(revisions);

    formattedRevisions.map(repo => {
      repo.revisions = groupArray(repo.revisions, 'entity', 'state.type', 'operation');
      mapKeys(repo.revisions, (revision, revKey) => {
        mapKeys(repo.revisions[revKey], (activity, activityKey) => {
          mapKeys(repo.revisions[revKey][activityKey], (content, contentKey) => {
            repo.revisions[revKey][activityKey][contentKey] = content.length;
          });
        });
      });
    });

    sendActivityDigest(user.get({ plain: true }), formattedRevisions);
  });
}

module.exports = processRepositoryRevisions;
