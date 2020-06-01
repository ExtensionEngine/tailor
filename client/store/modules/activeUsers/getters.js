import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import pick from 'lodash/pick';

export const activeUsers = state => {
  const activeUsersMap = { repository: {}, activity: {}, element: {} };
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
  const { repositoryId, activityId, elementId, created } = context;
  const userData = { ...pick(user, ['id', 'email', 'palette']), created };
  setEntityActivity(activeUsers, 'repository', repositoryId, userData);
  if (activityId) setEntityActivity(activeUsers, 'activity', activityId, userData);
  if (elementId) setEntityActivity(activeUsers, 'element', elementId, userData);
}

function setEntityActivity(activeUsers, entity, entityId, user) {
  const activityData = pick(user, ['id', 'email', 'palette', 'created']);
  const activeUsersOnEntity = activeUsers[entity][entityId];
  if (!activeUsersOnEntity) {
    activeUsers[entity][entityId] = [activityData];
    return;
  }
  if (find(activeUsersOnEntity, { id: user.id })) return;
  activeUsersOnEntity.push(activityData);
}
