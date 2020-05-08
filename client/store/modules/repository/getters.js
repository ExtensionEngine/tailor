import { getOutlineLevels, getSchema } from 'shared/activities';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import HashKit from 'hashkit';
import map from 'lodash/map';
import { role } from 'shared';
import values from 'lodash/values';

const hashkit = new HashKit({ chars: 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789' });

export const id = (_state, _getters, { route: { params: { repositoryId } } }) => {
  return repositoryId ? parseInt(repositoryId, 10) : null;
};

export const repository = (_state, getters, _rootState, { repositories }) => {
  if (!getters.id) return;
  return find(repositories, { id: getters.id });
};

export const schema = (_state, { repository }) => {
  return repository && getSchema(repository.schema).name;
};

export const structure = (_, { repository }) => {
  return repository && getOutlineLevels(repository.schema);
};

export const activities = (_state, getters, rootState) => {
  if (!getters.repository) return [];
  const { repository: { activities: { items } } } = rootState;
  return map(items, it => ({
    ...it,
    shortId: `A-${hashkit.encode(it.id)}`
  }));
};

export const outlineActivities = (_state, getters) => {
  const { activities, structure } = getters;
  const outlineTypes = map(structure, 'type');
  return filter(activities, it => outlineTypes.includes(it.type));
};

export const selectedActivity = (_state, getters, rootState) => {
  const { route: { params: { activityId } } } = rootState;
  if (!activityId) return;
  return find(getters.activities, { id: parseInt(activityId, 10) });
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
