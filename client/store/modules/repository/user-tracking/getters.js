import each from 'lodash/each';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';

export const getActiveUsers = (_state, getters, rootState) => {
  const { auth: { user: currentUser } } = rootState;
  return (entity, entityId) => {
    const users = getters.activityByEntity[entity][entityId] || [];
    return orderBy(users, 'connectedAt', 'desc')
      .filter(it => it.email !== currentUser.email);
  };
};

export const activityByEntity = state => {
  return Object.values(state.users).reduce((acc, { contexts, ...user }) => {
    contexts.forEach(ctx => setUserContext(acc, user, ctx));
    return acc;
  }, { repository: {}, activity: {}, element: {} });
};

function setUserContext(state, user, context) {
  const mappings = {
    repository: context.repositoryId,
    activity: context.activityId,
    element: context.elementId
  };
  each(mappings, (id, type) => {
    if (!id) return;
    const entity = state[type][id];
    if (!entity) {
      state[type][id] = [user];
      return;
    }
    if (find(entity, { id: user.id })) return;
    entity.push(user);
  });
}
