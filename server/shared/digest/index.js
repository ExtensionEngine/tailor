'use strict';
const CronTask = require('cron').CronJob;
const { processDigest, getRevisionsSinceDate } = require('./helpers');
const util = require('util');

async function initiateDigest() {
  const elementActivity = await getRevisionsSinceDate(new Date().setDate(new Date().getDate() - 7));
  // Vamo provjeravan kako izgleda query i pocetna obrada
  console.log(elementActivity);
}

module.exports = {
  initiateDigest
};
