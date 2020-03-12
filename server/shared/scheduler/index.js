'use strict';

const { CronTime, CronJob } = require('cron');
const logger = require('../logger');

function schedule(scheduleSettings, task) {
  const job = new CronJob(parseJsonCronParams(scheduleSettings), task);
  job.start();
  logger.info(`Next time scheduled: ${job.nextDate()}`);
}

module.exports = schedule;

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
  if (!value) return false;
  const val = value.includes(',')
    ? value
        .split(',')
        .map(param => {
          // Slight workaround the fact that jan is 0 which is a falsy value
          return CronTime.aliases[param] || CronTime.aliases[param] === 0
            ? CronTime.aliases[param].toString()
            : param.toString();
        })
        .join(',')
    : value.toString();

  return val;
}
