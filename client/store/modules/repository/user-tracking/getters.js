import each from 'lodash/each';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import pick from 'lodash/pick';

export const getActiveUsers = (_state, getters, rootState) => {
  const { auth: { user: currentUser } } = rootState;
  return (entity, entityId) => {
    const users = getters.users[entity][entityId] || [];
    return orderBy(users, 'connectedAt', 'desc')
      .filter(it => it.email !== currentUser.email);
  };
};

export const users = state => {
  return Object.values(state.users).reduce((acc, { contexts, ...user }) => {
    contexts.forEach(ctx => setUserContext(acc, user, ctx));
    return acc;
  }, { repository: {}, activity: {}, element: {} });
};

function setUserContext(state, user, context) {
  const data = pick(user, ['id', 'email', 'fullName', 'imgUrl', 'connectedAt']);
  const mappings = {
    repository: context.repositoryId,
    activity: context.activityId,
    element: context.elementId
  };
  each(mappings, (id, type) => {
    if (!id) return;
    const entity = state[type][id];
    if (!entity) {
      state[type][id] = [data];
      return;
    }
    if (find(entity, { id: user.id })) return;
    entity.push(data);
  });
}
