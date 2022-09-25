import forEach from 'lodash/forEach.js';
import groupBy from 'lodash/groupBy.js';
import { schema } from '../../config/shared/tailor.loader.js';
import sse from '../shared/sse/index.js';

const { isOutlineActivity } = schema;

function add(Activity, Hooks, Models) {
  const { Events } = Activity;

  const mappings = {
    [Hooks.afterCreate]: [sseCreate, touchRepository, touchOutline],
    [Hooks.afterUpdate]: [sseUpdate, touchRepository, touchOutline],
    [Hooks.afterBulkUpdate]: [afterTransaction(sseBulkUpdate)],
    [Hooks.afterDestroy]: [sseDelete, touchRepository, touchOutline]
  };

  forEach(mappings, (hooks, type) => {
    forEach(hooks, hook => Activity.addHook(type, Hooks.withType(type, hook)));
  });

  function sseCreate(_, activity) {
    sse.channel(activity.repositoryId).send(Events.Create, activity);
  }

  function sseUpdate(_, activity) {
    sse.channel(activity.repositoryId).send(Events.Update, activity);
  }

  async function sseBulkUpdate(_, { where }) {
    const activities = await Models.Activity.findAll({ where });
    const activitiesByRepository = groupBy(activities, 'repositoryId');
    forEach(activitiesByRepository, (activities, repositoryId) => {
      sse.channel(repositoryId).send(Events.BulkUpdate, activities);
    });
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

const afterTransaction = method => (type, opts) => {
  if (!opts.transaction) return method(type, opts);
  opts.transaction.afterCommit(() => method(type, opts));
};

export default {
  add
};
