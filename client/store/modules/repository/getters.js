import { getOutlineLevels, getSchema } from 'shared/activities';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import { role } from 'shared';
import values from 'lodash/values';

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

export const structure = (_, { repository }) => {
  return repository && getOutlineLevels(repository.schema);
};

export const activities = (_state, getters, rootState) => {
  if (!getters.repository) return [];
  const { repository: { activities: { items } } } = rootState;
  return Object.values(items);
};

export const outlineActivities = (_state, getters) => {
  const { activities, structure } = getters;
  const outlineTypes = map(structure, 'type');
  return filter(activities, it => outlineTypes.includes(it.type));
};

export const selectedActivity = (state, _getters, rootState) => {
  const { repository: { activities } } = rootState;
  return get(activities.items, state.activity, null);
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
