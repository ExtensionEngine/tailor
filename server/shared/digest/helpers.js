'use strict';

const groupArray = require('group-array');
const cronParser = require('cron-parser');
const logger = require('../../shared/logger');

const processRevisions = revisions => {
  const groupedRevisions = groupArray(revisions, 'user.email', 'repository.name', 'entity_operation');
  return groupedRevisions;
};

const parseInterval = () => {
  const weekDays = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6
  };

  const scheduleOptions = {
    minute: process.env.DIGEST_MINUTE,
    hour: process.env.DIGEST_HOUR,
    weekDay: weekDays[process.env.DIGEST_DAY.toUpperCase()] ? weekDays[process.env.DIGEST_DAY.toUpperCase()] : 0
  };
  const { minute, hour, weekDay } = scheduleOptions;

  const scheduleString = `0 ${minute} ${hour} * * ${weekDay}`;
  try {
    const interval = cronParser.parseExpression(scheduleString);
    logger.info('Next Delivery date: ', interval.next().toString());
  } catch (err) {
    throw new Error('Schedule options invalid\n' + err);
  }

  return scheduleString;
};

module.exports = {
  processRevisions,
  parseInterval
};
