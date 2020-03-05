'use strict';

const { CronTime, CronJob } = require('cron');
const logger = require('../logger');

const parseJsonCronParams = scheduleParams => {
  const {
    hour,
    minute,
    second,
    dayOfWeek,
    dayOfMonth,
    month
  } = JSON.parse(scheduleParams);

  if (!hour || !minute || !dayOfWeek) {
    logger.error('Must define hour, minute and day of week');
    throw new Error('Undefined params');
  }
  const time = new CronTime(new Date());

  const parsedDayOfWeek = (dayOfWeek && dayOfWeek.length === 3)
    ? CronTime.aliases[dayOfWeek].toString()
    : dayOfWeek;

  const parsedMonth = (month && month.length === 3)
    ? (CronTime.aliases[month]).toString()
    : month;

  time._parseField(second || '*', 'second', CronTime.constraints[0]);
  time._parseField(minute || '*', 'minute', CronTime.constraints[1]);
  time._parseField(hour || '*', 'hour', CronTime.constraints[2]);
  time._parseField(dayOfMonth || '*', 'dayOfMonth', CronTime.constraints[3]);
  time._parseField(parsedMonth || '*', 'month', CronTime.constraints[4]);
  time._parseField(parsedDayOfWeek || '*', 'dayOfWeek', CronTime.constraints[5]);
  return time;
};

const parseExpression = scheduleString => {
  const scheduleParams = getScheduleType(scheduleString);
  try {
    scheduleParams._verifyParse();
    return scheduleParams.toString();
  } catch (err) {
    logger.error('Invalid cron expression! Scheduled Task cancelled');
    throw new Error(err);
  }
};

const getScheduleType = settings => {
  try {
    const jsonString = parseJsonCronParams(settings);
    return jsonString;
  } catch (e) {
    return new CronTime(settings);
  }
};

const schedule = (scheduleSettings, task) => {
  const job = new CronJob(parseExpression(scheduleSettings), () => {
    task();
  });

  job.start();
  logger.info(`${task.name} has been started`);
  logger.info(`Next time scheduled: ${job.nextDate()}`);
};

module.exports = { schedule };
