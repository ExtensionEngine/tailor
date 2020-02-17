import { getLevel, getOutlineLevels, getSchema, getTesMeta } from 'shared/activities';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import { role } from 'shared';
import values from 'lodash/values';

const isTes = element => !!element.activityId;

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

export const getConfig = (_, { repository }) => {
  return element => {
    if (!element.type) return {};
    if (isTes(element)) return getTesMeta(repository.schema, element.type);
    return getLevel(element.type) || {};
  };
};

export const getRelationships = (_, { getConfig }) => {
  return element => {
    if (!element) return [];
    const config = getConfig(element);
    if (!config.relationships) return [];
    return map(config.relationships, it => {
      const value = get(element, `relationships.${it.key}`);
      return { ...it, value };
    });
  };
};

export const getMetadata = (_, { getConfig }) => {
  return element => {
    if (!element) return [];
    const config = getConfig(element);
    if (!config.meta) return [];
    return map(config.meta, it => {
      const value = get(element, `${isTes(element) ? 'meta' : 'data'}.${it.key}`);
      return { ...it, value };
    });
  };
};

export const users = state => values(state.users);

export const isRepositoryAdmin = (state, _, rootState) => {
  const { user } = rootState.auth;
  if (!user) return;
  const repositoryUser = find(state.users, { id: user.id });
  return get(repositoryUser, 'repositoryRole') === role.repository.ADMIN;
};
