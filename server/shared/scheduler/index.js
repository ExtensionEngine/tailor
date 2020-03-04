'use strict';

const { CronTime, CronJob } = require('cron');
const logger = require('../logger');
const cronParser = require('cron-parser');

const parseCronString = scheduleParams => {
  const { hour, minute, second, dayOfWeek, dayOfMonth, month } = JSON.parse(scheduleParams);
  if (!hour || !minute || !dayOfWeek) {
    logger.error('Must define hour minute and dayofWeek');
    throw new Error('Undefined params');
  }
  const time = new CronTime(new Date());

  time._parseField(second || '0', 'second', [0, 59]);
  time._parseField(minute, 'minute', [0, 59]);
  time._parseField(hour, 'hour', [0, 23]);
  time._parseField(dayOfMonth || '*', 'dayOfMonth', [1, 31]);
  time._parseField(month || '*', 'month', [0, 11]);
  time._parseField(dayOfWeek || '*', 'dayOfWeek', [0, 6]);

  try {
    const interval = cronParser.parseExpression(time.toString());
    logger.info('Next Delivery date: ', interval.next().toString());
    return true;
  } catch (err) {
    logger.error('Invalid cron expression!');
    throw new Error(err);
  }
};

const schedule = (scheduleSettings, task) => {
  parseCronString(scheduleSettings);
  const job = new CronJob(scheduleSettings, () => {
    task();
  });

  job.start();
  logger.info(`${task.name} has been started`);
};

module.exports = { schedule };
