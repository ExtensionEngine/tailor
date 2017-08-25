'use strict';

const Promise = require('bluebird');
const { Activity } = require('../shared/database');
const { OUTLINE_LEVELS } = require('../../config/shared/activities.js');
const GOAL = OUTLINE_LEVELS[0].type;

const where = {
  $or: [
    { deletedAt: { $ne: null }, detached: null },
    { parentId: null, type: { $ne: GOAL }, detached: null }
  ]
};
Promise.resolve(Activity.findAll({ where, paranoid: false }))
  .each(it => it.remove({ recursive: true, soft: true }))
  .then(() => {
    console.log('Activities and teaching elements detached');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
