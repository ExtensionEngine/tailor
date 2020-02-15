import { getLevel, getOutlineLevels, getSchema, getTesMeta } from 'shared/activities';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import { role } from 'shared';
import values from 'lodash/values';

const isTes = element => !!element.activityId;

export const repository = (_state, _getters, { route }, { repositories }) => {
  const repositoryId = get(route, 'params.repositoryId');
  if (!repositoryId) return;
  return find(repositories, { id: parseInt(repositoryId, 10) });
};

export const schema = (_state, getters) => {
  return getters.repository ? getSchema(getters.repository.schema).name : '';
};

export const structure = (_, { repository }) => {
  if (!repository) return;
  return getOutlineLevels(repository.schema);
};

export const activities = (_state, { repository }, _rootState, rootGetters) => {
  if (!repository) return;
  const { activities: items } = rootGetters;
  return filter(items, { repositoryId: repository.id });
};

export const activity = (state, _getters, _rootState, { activities }) => {
  return activities[state.activity] || {};
};

export const outlineActivities = (_, getters) => {
  const { activities, structure } = getters;
  const outlineTypes = map(structure, 'type');
  return filter(activities, it => outlineTypes.includes(it.type));
};

export const isCollapsed = state => {
  return activity => activity && !state.outline.expanded[activity._cid];
};

export const revisions = (_state, { repository }, _rootState, rootGetters) => {
  if (!repository) return [];
  return filter(rootGetters.revisions, { repositoryId: repository.id })
    .map(rev => ({ ...rev, createdAt: new Date(rev.createdAt) }))
    .sort((rev1, rev2) => rev2.createdAt - rev1.createdAt);
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
