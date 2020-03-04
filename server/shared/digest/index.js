'use strict';
const { processDigest } = require('./helpers');
const { User, RepositoryUser } = require('../database');
const { Sequelize } = require('../database');
const { Op } = require('sequelize');
const { subDays } = require('date-fns');

function getUsersThatLoggedIn() {
  return User.findAll({
    attributes: ['id', 'email'],
    where: {
      created_at: {
        [Op.ne]: Sequelize.col('user.updated_at')
      }
    }
  });
}

function filterRecentlyAddedRepositories(user) {
  return user.getRepositories({
    include: [
      {
        model: RepositoryUser,
        attributes: ['created_at'],
        where: {
          created_at: {
            [Op.lte]: subDays(new Date(), 3, new Date())
          }
        }
      }
    ]
  });
}

function getRevisionsSinceDate(date, repo) {
  return repo.getRevisions({
    where: {
      created_at: {
        [Op.lte]: date
      }
    },
    raw: true
  });
}

function getRevisions() {
  getUsersThatLoggedIn().then(users => {
    users.forEach(user => {
      const revisionsToSend = [];
      filterRecentlyAddedRepositories(user).then(reposNotAddedRecently => {
        reposNotAddedRecently.forEach(repo => {
          if (
            repo.repositoryUser.dataValues.createdAt <
            subDays(new Date(), 10, new Date())
          ) {
            // ako je dodan prije vise od 10 dana
            getRevisionsSinceDate(
              subDays(new Date(), 7, new Date(), repo)
            ).then(revisions => {
              revisionsToSend.push(revisions);
            });
          } else {
            // ako je dodan unutar 10 dana
            getRevisionsSinceDate(
              repo.repositoryUser.dataValues.createdAt,
              repo
            ).then(revisions => {
              revisionsToSend.push(revisions);
            });
          }
        });
      });
      setTimeout(() => console.log(revisionsToSend, user.dataValues.email), 300);
    });
  });
}

function initiateDigest() {
  getRevisions();
}

module.exports = {
  initiateDigest
};
