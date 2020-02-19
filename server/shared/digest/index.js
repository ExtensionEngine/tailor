'use strict';

const cron = require('node-cron');
const { User, Revision, Repository } = require('../database');
const { Op } = require('sequelize');
const mail = require('../mail');
const { aggregateRevisions } = require('./helpers');

const scheduleOptions = {
  minute: process.env.DIGEST_MINUTE,
  hour: process.env.DIGEST_HOUR,
  weekDay: process.env.DIGEST_DAY
};

function initiateDigest() {
  const { minute, hour, weekDay } = scheduleOptions;
  const scheduleString = `${minute} ${hour} * * ${weekDay}`;
  cron.schedule(scheduleString, () => {
    const users = User.findAll({ attributes: ['id', 'email', 'fullName'], raw: true });
    users.map(async user => {
      const revisions = await Revision.findAll({
        attributes: ['id', 'entity', 'operation', 'repository_id'],
        include: [{
          model: Repository,
          attributes: ['name'],
          paranoid: false
        }],
        where: {
          user_id: user.id,
          created_at: {
            [Op.gte]: (new Date().setDate(new Date().getDate() - 7))
          }
        },
        raw: true
      });
      const aggregate = aggregateRevisions(revisions);
      // Komentar za Sergija:
      // Logika je da se digest samo salje kad je bilo ikakvih promjena
      if (aggregate.length) mail.sendActivityDigest(user, aggregate);
    });
  });
}

module.exports = {
  initiateDigest
};
