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
function insert({ newActivity, activityCollection }) {
  const db = require('@arangodb').db;
  const collection = db._collection(activityCollection);

  // parentKey can either be null (meaning, this is one of root activities),
  // or must point to another activity (parent-child relationship).
  if (newActivity.parentKey && !collection.exists(newActivity.parentKey)) {
    throw new Error(`Parent activity (${newActivity.parentKey}) does not exist`);
  }

  const saveNew = `INSERT @newActivity IN @@collection RETURN NEW`;
  const bindVars = { newActivity, '@collection': activityCollection };

  const countSiblings = `
    RETURN LENGTH(
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
  const updateExisting = `
    FOR activity IN @@collection
      FILTER activity.courseKey == @newActivity.courseKey AND
             activity.parentKey == @newActivity.parentKey AND
             activity.position >= @newActivity.position
      UPDATE activity WITH { position: activity.position + 1 } IN @@collection`;
  db._query(updateExisting, bindVars);
  return db._query(saveNew, bindVars).next();
}

/**
 * Change position of one activity among its siblings.
 * @memberof Activity.Action
 *
 * @param {object} param - Action parameters.
 * @param {string} param.courseKey - Course which contains the activity.
 * @param {string} param.activityKey - Activity to reorder.
 * @param {number} param.requestedPosition - New position.
 * @param {string} param.activityCollection - Name of the collection containing
 * all activities.
 * @return {Promise<object>} Updated activity.
 */
function reorder({ courseKey, activityKey, requestedPosition, activityCollection }) {
  const db = require('@arangodb').db;

  const findActivity = `
    FOR act IN @@collection
      FILTER act.courseKey == @courseKey AND
             act._key == @activityKey
      RETURN act`;
  const activity = db._query(findActivity, {
    courseKey,
    activityKey,
    '@collection': activityCollection
  }).next();

  if (!activity) {
    throw new Error(
    `Activity (${activityKey}) in course (${courseKey}) does not exist`);
  }

  // New position is whatever client requested (requestedPosition), but
  // clamped to range [0, N), where N is the number of sibling activities.
  let newPosition;
  if (requestedPosition < 0) {
    newPosition = 0;
  } else {
    const countSiblings = `
      RETURN LENGTH(
        FOR act IN @@collection
          FILTER act.courseKey == @activity.courseKey AND
                 act.parentKey == @activity.parentKey
          RETURN act)`;
    const numSiblings = db._query(countSiblings, {
      activity,
      '@collection': activityCollection
    }).next();

    newPosition = requestedPosition >= numSiblings
      ? (numSiblings - 1)
      : requestedPosition;
  }

  // Activity is already at requested position - nothing to do here.
  if (newPosition === activity.position) return activity;

  const isMovingToLargerPos = newPosition > activity.position;
  // smallest position affected by reorder
  const from = isMovingToLargerPos ? activity.position + 1 : newPosition;
  // largest position affected by reorder
  const to = isMovingToLargerPos ? newPosition : activity.position - 1;
  // increment or decrement each position
  const step = isMovingToLargerPos ? -1 : 1;

  const updateAffected = `
    FOR act IN @@collection
      FILTER act.courseKey == @activity.courseKey AND
             act.parentKey == @activity.parentKey AND
             act.position >= @from AND
             act.position <= @to
      UPDATE act WITH { position: act.position + @step } IN @@collection`;
  db._query(updateAffected, {
    from,
    to,
    step,
    activity,
    '@collection': activityCollection
  });

  const moveToNewPos = `
    FOR act IN @@collection
      FILTER act._key == @activityKey
      UPDATE act WITH { position: @newPosition } IN @@collection
      RETURN NEW`;
  return db._query(moveToNewPos, {
    activityKey,
    newPosition,
    '@collection': activityCollection
  }).next();
}

/**
 * Remove an activity and all its sub-activities.
 * @memberof Activity.Action
 *
 * @param {object} param - Action parameters.
 * @param {string} param.courseKey - Course which contains the activity.
 * @param {string} param.activityKey - Activity to remove.
 * @param {string} param.activityCollection - Name of the collection containing
 * all activities.
 * @return {Promise<object[]>} Array of removed activities.
 */
function remove({ courseKey, activityKey, activityCollection }) {
  const db = require('@arangodb').db;

  const findActivity = `
    FOR act IN @@collection
      FILTER act.courseKey == @courseKey AND
             act._key == @activityKey
      RETURN act`;
  const activity = db._query(findActivity, {
    courseKey,
    activityKey,
    '@collection': activityCollection
  }).next();

  if (!activity) {
    throw new Error(
    `Activity (${activityKey}) in course (${courseKey}) does not exist`);
  }

  const getAll = `
    FOR act IN @@collection
      FILTER act.courseKey == @courseKey
      RETURN act`;
  const activities = db._query(getAll, {
    courseKey,
    '@collection': activityCollection
  }).toArray();

  // Recursively find all descendants/children of the given activity, and
  // remove them (including the starting activity).
  function getSubtreeRec(startNode, allNodes) {
    let result = [startNode];
    for (const node of allNodes) {
      if (node.parentKey === startNode._key) {
        result = result.concat(getSubtreeRec(node, allNodes));
      }
    }
    return result;
  }

  const keysToRemove = getSubtreeRec(activity, activities).map(a => a._key);
  const removeRelated = `
    FOR act IN @@collection
      FILTER act.courseKey == @courseKey AND
             act._key IN @keysToRemove
      REMOVE act IN @@collection
      RETURN OLD`;
  const removed = db._query(removeRelated, {
    courseKey,
    keysToRemove,
    '@collection': activityCollection
  }).toArray();

  // Once activity is removed, its siblings need to readjust their position.
  const compactSiblings = `
    FOR act in @@collection
      FILTER act.courseKey == @courseKey AND
             act.parentKey == @activity.parentKey AND
             act.position > @activity.position
      UPDATE act WITH { position: act.position - 1 } IN @@collection`;
  db._query(compactSiblings, {
    courseKey,
    activity,
    '@collection': activityCollection
  });

  return removed;
}

module.exports = {
  insert,
  reorder,
  remove
};
