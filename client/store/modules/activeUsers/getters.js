import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import omit from 'lodash/omit';
import orderBy from 'lodash/orderBy';

export const activeUsers = state => {
  let activeUsersMap = { course: {}, activity: {}, element: {} };
  Object.keys(state.activeUsers).forEach(userId => {
    state.activeUsers[userId].contexts.forEach(context => {
      mapContext(activeUsersMap, state.activeUsers[userId], context);
    });
  });
  return activeUsersMap;
};

export const getUsedPalettes = state => {
  return filter(map(state.activeUsers, user => get(user.palette, 'id', null)));
};

export const getActiveUsers = (_state, getters) => {
  return (entity, entityId) => {
    return orderBy(getters.activeUsers[entity][entityId], 'created', 'desc') || [];
  };
};

function mapContext(activeUsers, user, context) {
  const { id, email, palette } = user;
  const { created } = context;
  const ommitedFields = ['created', 'sseId'];
  Object.keys(omit(context, ommitedFields)).forEach(key => {
    const entityName = key.substring(0, key.length - 2);
    const entityId = context[key];
    if (activeUsers[entityName][entityId]) {
      const user = find(activeUsers[entityName][entityId], { id });
      if (user) return;
      activeUsers[entityName][entityId].push({ id, email, palette, created });
      return;
    }
    activeUsers[entityName][entityId] = [{ id, email, palette, created }];
  });
}
