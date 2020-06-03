import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import pick from 'lodash/pick';

export const activeUsers = state => {
  const result = { repository: {}, activity: {}, element: {} };
  const activeUsers = Object.values(state.activeUsers);
  activeUsers.forEach(({ contexts, ...user }) => {
    contexts.forEach(context => {
      setUserActivityForContext(result, user, context);
    });
  });
  return result;
};

export const getActiveUsers = (_state, getters) => {
  return (entity, entityId) => {
    return orderBy(getters.activeUsers[entity][entityId], 'created', 'desc') || [];
  };
};

function setUserActivityForContext(activeUsers, user, context) {
  console.log('Ovo je user: ', user);
  const { repositoryId, activityId, elementId, created } = context;
  const userData = { ...pick(user, ['id', 'fullName', 'email', 'palette', 'imgUrl']), created };
  setEntityActivity(activeUsers, 'repository', repositoryId, userData);
  if (activityId) setEntityActivity(activeUsers, 'activity', activityId, userData);
  if (elementId) setEntityActivity(activeUsers, 'element', elementId, userData);
}

function setEntityActivity(activeUsers, entity, entityId, user) {
  const activityData = pick(user, ['id', 'fullName', 'email', 'palette', 'created', 'imgUrl']);
  const activeUsersOnEntity = activeUsers[entity][entityId];
  if (!activeUsersOnEntity) {
    activeUsers[entity][entityId] = [activityData];
    return;
  }
  if (find(activeUsersOnEntity, { id: user.id })) return;
  activeUsersOnEntity.push(activityData);
}
