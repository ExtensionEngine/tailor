'use strict';

const cron = require('node-cron');
const { User, Revision, Repository } = require('../database');
const { sql } = require('../database/helpers');
const { col, fn, Op } = require('sequelize');
const { processRevisions, parseInterval, separateUsersAndSend } = require('./helpers');

function initiateDigest() {
  cron.schedule(parseInterval(), async () => {
    const revisions = await Revision.findAll({
      attributes: [
        [
          sql.concat(col('operation'), col('entity'), { separator: ' ' }),
          'entity_operation'
        ],
        [fn('count', sql.concat('operation', 'entity')), 'count'],
        'user_id',
        'repository_id'
      ],
      group: [
        'repository_id',
        'user.id',
        'user_id',
        'entity_operation',
        'repository.name',
        'repository.created_at'
      ],
      include: [
        {
          model: User,
          attributes: ['email', 'fullName']
        },
        {
          model: Repository,
          attributes: ['name', 'created_at'],
          where: {
            created_at: {
              [Op.gte]: new Date().setDate(new Date().getDate() - 7)
            }
          }
        }
      ],
      raw: true
    });

    separateUsersAndSend(processRevisions(revisions));
  });
}

module.exports = {
  initiateDigest
};
