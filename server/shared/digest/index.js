'use strict';
const { processDigest } = require('./helpers');
const { User, RepositoryUser } = require('../database');
const { Sequelize } = require('../database');
const { Op } = require('sequelize');
const { subDays } = require('date-fns');

async function initiateDigest() {
  await User.findAll({
    attributes: ['id', 'email'],
    where: {
      created_at: {
        [Op.ne]: Sequelize.col('user.updated_at')
      }
    }
  }).then(users =>
    users.map(user => {
      const result = [];
      user
        .getRepositories({
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
        })
        .map(async repo => {
          if (
            repo.repositoryUser.dataValues.createdAt <
            subDays(new Date(), 10, new Date())
          ) {
            result.push(
              await repo.getRevisions({
                where: {
                  created_at: {
                    [Op.gte]: subDays(new Date(), 7, new Date())
                  }
                },
                raw: true
              })
            );
          } else {
            result.push(
              await repo.getRevisions({
                where: {
                  created_at: {
                    [Op.gte]: repo.repositoryUser.dataValues.createdAt
                  }
                },
                raw: true
              })
            );
          }
        });
      processDigest(user, result);
    })
  );
}

module.exports = {
  initiateDigest
};
