import { getOutlineLevels, getSchema } from 'shared/activities';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getWorkflow } from 'shared/workflow';
import Hashids from 'hashids';
import map from 'lodash/map';
import { role } from 'shared';
import values from 'lodash/values';

const HASH_ALPHABET = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
const hashids = new Hashids('', 0, HASH_ALPHABET);

export const id = (_state, _getters, { route: { params: { repositoryId } } }) => {
  return repositoryId ? parseInt(repositoryId, 10) : null;
};

export const repository = (_state, getters, _rootState, rootGetters) => {
  if (!getters.id) return;
  const repositories = rootGetters['repositories/repositories'];
  return find(repositories, { id: getters.id });
};

export const schema = (_state, { repository }) => {
  return repository && getSchema(repository.schema).name;
};

export const workflow = (_state, { repository }) => {
  if (!repository) return null;
  const schema = getSchema(repository.schema);
  return getWorkflow(schema.workflowId);
};

export const hasWorkflow = (_state, { workflow }) => !!workflow;

export const structure = (_, { repository }) => {
  return repository && getOutlineLevels(repository.schema);
};

export const activities = (_state, getters, rootState) => {
  if (!getters.repository) return [];
  const { repository: { activities: { items } } } = rootState;
  return map(items, it => ({
    ...it,
    shortId: `A-${hashids.encode(it.id)}`
  }));
};

export const tasks = (_state, getters, rootState) => {
  if (!getters.repository) return [];
  const { repository: { tasks: { items } } } = rootState;
  return map(items, it => ({
    ...it,
    shortId: `T-${hashids.encode(it.id)}`
  }));
};

export const outlineActivities = (_state, getters) => {
  const { activities, structure } = getters;
  const outlineTypes = map(structure, 'type');
  return filter(activities, it => outlineTypes.includes(it.type));
};

export const selectedActivity = (_state, getters, rootState) => {
  const { route: { query: { activityId } } } = rootState;
  if (!activityId) return;
  return find(getters.activities, { id: parseInt(activityId, 10) });
};

export const selectedTask = (_state, getters, rootState) => {
  const { route: { query: { taskId } } } = rootState;
  if (!taskId) return;
  return find(getters.tasks, { id: parseInt(taskId, 10) });
};

export const workflowActivities = (_state, { structure }) => {
  if (!structure) return [];
  return structure.filter(activity => activity.isTrackedInWorkflow);
};

export const isCollapsed = state => {
  return activity => activity && !state.outline.expanded[activity._cid];
};

export const users = state => values(state.users);

export const isRepositoryAdmin = (state, _, rootState) => {
  const { user } = rootState.auth;
  if (!user) return;
  const repositoryUser = find(state.users, { id: user.id });
  return get(repositoryUser, 'repositoryRole') === role.repository.ADMIN;
};
