'use strict';

const { CronTime, CronJob } = require('cron');
const logger = require('../logger');

function schedule(scheduleSettings, task) {
  const job = new CronJob(getSettingType(scheduleSettings), task);
  job.start();
  logger.info(`Next time scheduled: ${job.nextDate()}`);
}

module.exports = schedule;

function getSettingType(settings) {
  if (typeof settings === 'string' || settings instanceof String) {
    return settings;
  } else {
    return parseJsonCronParams(settings);
  }
}

function parseJsonCronParams(scheduleParams) {
  const time = new CronTime(new Date());
  const timeUnits = [
    'second',
    'minute',
    'hour',
    'dayOfMonth',
    'month',
    'dayOfWeek'
  ];

  timeUnits.forEach((unit, index) => {
    time._parseField(
      parseAlias(scheduleParams[unit]) ||
      CronTime.parseDefaults[index],
      unit,
      CronTime.constraints[index]
    );
  });
  return time.toString();
}

function parseAlias(value) {
  if (!value) {
    return false;
  }
  return value && value.length === 3
    ? CronTime.aliases[value].toString()
    : value.toString();
}
