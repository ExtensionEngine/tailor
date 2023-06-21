import { addContext, getActiveUsers, removeContext } from './store.js';
import isEqual from 'lodash/isEqual.js';
import pick from 'lodash/pick.js';
import sse from '../../shared/sse/index.js';
import { UserActivity } from '../../../common/sse.js';

const USER_ATTRS = [
  'id', 'email', 'firstName', 'lastName', 'fullName', 'label', 'imgUrl'
];

function subscribe({ repository, user }, { sse: connection }) {
  connection.once('close', () => onUnsubscribe(connection, { repository, user }));
  connection.join(repository.id);
}

async function onUnsubscribe(connection, { repository, user }) {
  await removeContext(user, it => it.sseId === connection.id);
  sse.channel(repository.id)
    .send(UserActivity.EndSession, { sseId: connection.id, userId: user.id });
}

async function fetchUserActivities(_req, res) {
  const items = await getActiveUsers();
  res.json({ data: { items } });
}

async function addUserActivity({ user, body: { context } }, res) {
  res.end();
  user = pick(user, USER_ATTRS);
  await addContext(user, context);
  sse.channel(context.repositoryId).send(UserActivity.Start, { user, context });
}

async function removeUserActivity({ user, body: { context } }, res) {
  res.end();
  user = pick(user, USER_ATTRS);
  const { connectedAt, ...targetCtx } = context;
  const compareBy = Object.keys(targetCtx);
  await removeContext(user, it => isEqual(pick(it, compareBy), targetCtx));
  sse.channel(context.repositoryId).send(UserActivity.End, { user, context });
}

export default {
  subscribe,
  fetchUserActivities,
  addUserActivity,
  removeUserActivity
};
