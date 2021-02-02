'use strict';

const {
  getSchema,
  getSchemaId,
  isOutlineActivity,
  isTrackedInWorkflow
} = require('../../config/shared/activities');
const forEach = require('lodash/forEach');
const { getDefaultWorkflowStatus } = require('../../config/shared/workflow');
const sse = require('../shared/sse');

module.exports = { add };

function add(Activity, Hooks, Models) {
  const { Events } = Activity;

  const mappings = {
    [Hooks.afterCreate]: [createStatus, sseCreate, touchRepository, touchOutline],
    [Hooks.afterUpdate]: [sseUpdate, touchRepository, touchOutline],
    [Hooks.afterDestroy]: [sseDelete, touchRepository, touchOutline]
  };

  forEach(mappings, (hooks, type) => {
    forEach(hooks, hook => Activity.addHook(type, Hooks.withType(type, hook)));
  });

  function createStatus(_, activity) {
    if (!isTrackedInWorkflow(activity.type)) return;
    const schemaId = getSchemaId(activity.type);
    const { workflowId } = getSchema(schemaId);
    const defaultStatus = getDefaultWorkflowStatus(workflowId);
    return activity.createStatus(defaultStatus);
  }

  function sseCreate(_, activity) {
    sse.channel(activity.repositoryId).send(Events.Create, activity);
  }

  function sseUpdate(_, activity) {
    sse.channel(activity.repositoryId).send(Events.Update, activity);
  }

  async function sseDelete(_, activity) {
    await activity.reload({ paranoid: false });
    sse.channel(activity.repositoryId).send(Events.Delete, activity);
  }

  const isRepository = it => it instanceof Models.Repository;

  function touchRepository(hookType, activity, { context = {} }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    // setting correct hasUnpublishedChanges value is handled by
    // remove activity middleware for outline activities
    return hookType === Hooks.afterDestroy && isOutlineActivity(activity.type)
      ? Promise.resolve()
      : context.repository.update({ hasUnpublishedChanges: true });
  }

  async function touchOutline(activity, { context = {}, transaction }) {
    if (!isRepository(context.repository)) return Promise.resolve();
    const outlineActivity = isOutlineActivity(activity.type)
      ? activity
      : await activity.getOutlineParent(transaction);
    return outlineActivity && outlineActivity.touch(transaction);
  }
}
