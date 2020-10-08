import each from 'lodash/each';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import pick from 'lodash/pick';

export const users = state => {
  const result = { repository: {}, activity: {}, element: {} };
  const users = Object.values(state.users);
  users.forEach(({ contexts, ...user }) => {
    contexts.forEach(ctx => setUserContext(result, user, ctx));
  });
  return result;
};

export const getActiveUsers = (_state, getters, state) => {
  const { auth: { user: currentUser } } = state;
  return (entity, entityId) => {
    const users = getters.users[entity][entityId] || [];
    return orderBy(users, 'connectedAt', 'desc')
      .filter(it => it.email !== currentUser.email);
  };
};

function setUserContext(state, user, context) {
  const data = pick(user, ['id', 'email', 'fullName', 'imgUrl']);
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
