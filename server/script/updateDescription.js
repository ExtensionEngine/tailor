'use strict';

const { Activity } = require('../shared/database');
const Promise = require('bluebird');

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('You must supply activity type!');
  process.exit(1);
}

const type = args[0];

Activity.findAll({ where: { type } })
  .then(processActivities)
  .then(() => {
    console.log('Activities processed');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

function processActivities(activities) {
  return Promise.each(activities, it => {
    it.data = it.data || {};
    it.data.description = it.name;
    it.changed('data', true);
    return it.save();
  });
}
