'use strict';

const cron = require('node-cron');
const { User, Revision } = require('../database');
const { Op } = require('sequelize');
const mail = require('../mail');

function initiateDigest() {
  cron.schedule('*/2 * * * *', () => {
    const users = User.findAll({ raw: true });
    users.map(async user => {
      const revisions = await Revision.findAll({
        where: {
          user_id: user.id,
          created_at: {
            [Op.gte]: (new Date().setDate(new Date().getDate() - 7))
          }
        },
        raw: true
      });
      mail.sendActivityDigest(user, revisions);
    });
  });
}

module.exports = {
  initiateDigest
};
