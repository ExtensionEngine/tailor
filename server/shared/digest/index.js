'use strict';

const cron = require('node-cron');
const { User, Revision, Repository } = require('../database');
const { Op } = require('sequelize');
const mail = require('../mail');
const { aggregateRevisions } = require('./helpers');

function initiateDigest() {
  cron.schedule('*/5 * * * * *', () => {
    const users = User.findAll({ attributes: ['id', 'email', 'fullName'], raw: true });
    users.map(async user => {
      const revisions = await Revision.findAll({
        attributes: ['id', 'entity', 'operation', 'repository_id'],
        include: [{
          model: Repository,
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
      console.log(aggregateRevisions(revisions));
      // mail.sendActivityDigest(user, aggregateRevisions(revisions));
    });
  });
}

module.exports = {
  initiateDigest
};
