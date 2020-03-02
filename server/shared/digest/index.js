'use strict';
const CronTask = require('cron').CronJob;
const { User, Revision, Repository } = require('../database');
const { sql } = require('../database/helpers');
const { col, fn, Op } = require('sequelize');
const { processRevisions, parseInterval, separateUsersAndSend } = require('./helpers');

function initiateDigest() {
  const digest = new CronTask(parseInterval(), async () => {
    const revisions = await Revision.findAll({
      attributes: [
        [
          sql.concat(col('operation'), col('entity'), { separator: ' ' }),
          'entity_operation'
        ],
        [fn('count', sql.concat('operation', 'entity')), 'count'],
        'user_id',
        'repository_id',
        'revision.created_at'
      ],
      group: [
        'repository_id',
        'user.id',
        'user_id',
        'entity_operation',
        'repository.name',
        'repository.created_at',
        'revision.created_at'
      ],
      include: [
        {
          model: User,
          attributes: ['email', 'fullName', 'created_at'],
          where: {
            created_at: {
              [Op.lte]: new Date().setDate(new Date().getDate() - 7)
            }
          }
        },
        {
          model: Repository,
          attributes: ['name', 'created_at']
        }
      ],
      where: {
        created_at: {
          [Op.gte]: new Date().setDate(new Date().getDate() - 7)
        }
      },
      raw: true
    });

    separateUsersAndSend(processRevisions(revisions));
  }, null, true);

  digest.start();
}

module.exports = {
  initiateDigest
};
