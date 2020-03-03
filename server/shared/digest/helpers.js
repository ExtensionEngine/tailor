'use strict';

const groupArray = require('group-array');
const cronParser = require('cron-parser');
const mapKeys = require('lodash/mapKeys');
const logger = require('../../shared/logger');
const mail = require('../mail');
const pick = require('lodash/pick');

// Nova funkcija
const processDigest = revisions => {
  const processedRevisions = revisions.map(revision => {
    // Pick stvara novi objekt od staroga sa tin keyevima sta pickas tu
    return pick(revision,
      [
        'repository.users.email',
        'repository.name',
        'repository.data',
        'repository.created_at',
        'repository.repositoryUsers.repository_user_added',
        'activity.parent_id',
        'activity_id',
        'activity_type',
        'activity_data',
        'content_id',
        'content_type',
        'content_data',
        'repository.revisions.operation'
      ]);
  });

  // grupira redom po tin keyevima znaci otpr ovako
  // { 'admin@extensionengine.com':
  //  { 'Reponame':
  //     { '3':
  //        { '4':
  //           { '3':   ...
  return groupArray(
    processedRevisions,
    'repository.users.email',
    'repository.name',
    'activity.parent_id',
    'activity_id',
    'content_id'
  );
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
    weekDay: weekDays[process.env.DIGEST_DAY.toUpperCase()]
      ? weekDays[process.env.DIGEST_DAY.toUpperCase()]
      : 0
  };
  const { minute, hour, weekDay } = scheduleOptions;

  const scheduleString = `${minute} ${hour} * * ${weekDay}`;
  try {
    const interval = cronParser.parseExpression(scheduleString);
    logger.info('Next Delivery date: ', interval.next().toString());
  } catch (err) {
    logger.error(err);
    throw new Error('Schedule options invalid\n');
  }

  return scheduleString;
};

const countActionOcurrences = activity => {
  const activitiesQuantified = [];
  mapKeys(activity, (changes, repository) => {
    activitiesQuantified.push({ repositoryName: repository, data: {} });
    mapKeys(changes, (listOfChanges, changeType) => {
      activitiesQuantified[activitiesQuantified.length - 1].data[changeType] =
        !(changeType === 'CREATE REPOSITORY')
          ? listOfChanges.length
          : changes['CREATE REPOSITORY'][0]['repository.created_at'];
    });
  });
  return activitiesQuantified;
};

const separateUsersAndSend = revisions => {
  mapKeys(revisions, (activity, user) => {
    mail.sendActivityDigest(user, countActionOcurrences(activity));
  });
};

module.exports = {
  processDigest,
  parseInterval,
  separateUsersAndSend
};
