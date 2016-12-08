'use strict';
/**
 * Functions executed in activity-related transactions.
 * @namespace Activity.Action
 */

/**
 * Insert new activity.
 * @memberof Activity.Action
 *
 * @param {object} param - Action parameters.
 * @param {object} param.newActivity - Activity document to insert.
 * @param {string} param.activityCollection - Name of the collection containing
 * all activities.
 * @return {Promise<object>} Inserted activity.
 */
function INSERT({ newActivity, activityCollection }) {
  const db = require('@arangodb').db;
  const collection = db._collection(activityCollection);

  // parentKey can either be null (meaning, this is one of root activities),
  // or must point to another activity (parent-child relationship).
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

  // Place the new activity at the end of the array of its siblings and return.
  if (newActivity.position === undefined ||
      newActivity.position === null ||
      newActivity.position >= numSiblings) {
    newActivity.position = numSiblings;
    return db._query(saveNew, bindVars).next();
  }

  if (newActivity.position < 0) newActivity.position = 0;

  // Place the new activity at the specified position, and push activities
  // behind it one place further.
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
};
