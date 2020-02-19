'use strict';

const cron = require('node-cron');
const { User, Revision } = require('../database');

async function initiateDigest() {
  cron.schedule('*/2 * * * * *', () => {
    const users = User.findAll({ raw: true });
    users.map(user => {
      const revisions = Revision.findAll({ where: { user_id: user.id }, raw: true });
      console.log(revisions);
    });
  });
}

module.exports = {
  initiateDigest
};
