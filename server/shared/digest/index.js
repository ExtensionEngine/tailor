'use strict';

const cron = require('node-cron');
const { User, Revision, Repository } = require('../database');
const { sql } = require('../database/helpers');
const { col, fn } = require('sequelize');
const mail = require('../mail');
const { aggregateRevisions } = require('./helpers');

const scheduleOptions = {
  minute: process.env.DIGEST_MINUTE,
  hour: process.env.DIGEST_HOUR,
  weekDay: process.env.DIGEST_DAY
};

function initiateDigest() {
  const { minute, hour, weekDay } = scheduleOptions;
  const scheduleString = `*/5 ${minute} ${hour} * * ${weekDay}`;
  cron.schedule(scheduleString, async () => {
    const revisions = await Revision.findAll({
      attributes: [
        [sql.concat(col('operation'), col('entity'), { separator: ' ' }), 'entity_operation'],
        [fn('count', sql.concat('operation', 'entity')), 'count'],
        'user_id',
        'repository_id'
      ],
      group: ['repository_id', 'user.id', 'user_id', 'entity_operation', 'repository.name', 'repository.created_at'],
      include: [{
        model: User,
        attributes: ['email', 'fullName']
      },
      {
        model: Repository,
        attributes: ['name', 'created_at']
      }
      ],
      raw: true
    });
    const aggregate = aggregateRevisions(revisions);
    mail.sendActivityDigest(aggregate);
  });
}

module.exports = {
  initiateDigest
};
