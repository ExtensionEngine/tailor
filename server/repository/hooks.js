'use strict';
const cron = require('node-cron');

exports.add = (Repository, Hooks, db) => {
  Repository.addHook(Hooks.afterCreate, repository => {
    // const scheduleString = `0 15 * * ${(new Date()).getDay()}`;
    cron.schedule('* * * * *', () => {
      sendDigest(repository, db);
    });
  });
};

async function sendDigest(repository, db) {
  const { User, Repository, Revision } = db;

  const result = await Repository.findAll({
    where: { id: repository.id },
    include: User
  });

  const revisions = await Revision.findAll({ where: { repository_id: repository.id } }, { raw: true })
      .then(data => data.map(val => val.get({ plain: true })))
      .then(revisions => { console.log(revisions); });
}
