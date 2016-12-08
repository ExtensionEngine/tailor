'use strict';

function INSERT({ newActivity, activityCollection }) {
  const arango = require('@arangodb');
  const db = arango.db;
  const aql = arango.aql;
  const collection = db._collection(activityCollection);

  if (newActivity.parentKey && !collection.exists(newActivity.parentKey)) {
    throw new Error(
      `Parent activity (${newActivity.parentKey}) does not exist`);
  }

  const saveNew = `INSERT @newActivity IN @@collection RETURN NEW`;
  const bindVars = { newActivity, '@collection': activityCollection };

  const countSiblings = `RETURN LENGTH(
    FOR activity IN @@collection
      FILTER activity.courseKey == @newActivity.courseKey AND
             activity.parentKey == @newActivity.parentKey
      RETURN activity)`;
  const numSiblings = db._query(countSiblings, bindVars).next();

  if (newActivity.position === undefined ||
      newActivity.position === null ||
      newActivity.position >= numSiblings) {
    newActivity.position = numSiblings;
    return db._query(saveNew, bindVars).next();
  }

  if (newActivity.position < 0) newActivity.position = 0;

  const updateExisting = `FOR activity IN @@collection
    FILTER activity.courseKey == @newActivity.courseKey AND
           activity.parentKey == @newActivity.parentKey AND
           activity.position >= @newActivity.position
    UPDATE activity WITH { position: activity.position + 1 } IN @@collection`;
  db._query(updateExisting, bindVars);
  return db._query(saveNew, bindVars).next();
}

module.exports = {
  INSERT
}
