import forEach from 'lodash/forEach.js';
import get from 'lodash/get.js';
import mail from '../shared/mail/index.js';
import { Op } from 'sequelize';
import { schema } from '../../config/shared/tailor.loader.js';
import sse from '../shared/sse/index.js';

const add = (ActivityStatus, Hooks, { Activity }) => {
  const { Events } = ActivityStatus;

  const mappings = {
    [Hooks.afterCreate]: [withActivity(sseUpdate, notifyAssignee)]
  };

  forEach(mappings, (hooks, type) => {
    forEach(hooks, hook => {
      ActivityStatus.addHook(type, Hooks.withType(type, hook));
    });
  });

  function sseUpdate(_, activity) {
    sse.channel(activity.repositoryId).send(Events.Update, activity);
  }

  async function notifyAssignee(_, activity, { context = {} }) {
    const userId = get(context, 'user.id');
    const [status] = activity.status;
    if (!status.assigneeId) return;
    const previousStatus = await ActivityStatus.findOne({
      where: {
        [Op.not]: { id: status.id },
        activityId: status.activityId
      },
      order: [['createdAt', 'DESC']]
    });
    const isUnchanged = previousStatus.assigneeId === status.assigneeId;
    const isSelfAssign = status.assigneeId === userId;
    if (isUnchanged || isSelfAssign) return;
    sendEmailNotification(activity);
  }

  function withActivity(...hooks) {
    const invokeHooks = (type, status, opts) => status.getActivity()
      .then(activity => hooks.forEach(hook => hook(type, activity, opts)));
    return afterTransaction(invokeHooks);
  }
};

async function sendEmailNotification(activity) {
  const { label } = schema.getLevel(activity.type);
  const [status] = activity.status;
  mail.sendAssigneeNotification(status.assignee.email, {
    ...activity.toJSON(),
    label: label.toLowerCase()
  });
}

const afterTransaction = method => (type, status, opts) => {
  if (!opts.transaction) return method(type, status, opts);
  opts.transaction.afterCommit(() => method(type, status, opts));
};

export default {
  add
};
