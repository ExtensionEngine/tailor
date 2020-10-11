import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import Vue from 'vue';

const fetch = (state, users) => {
  state.users = users;
};

const start = (state, { user, context }) => {
  const userState = state.users[user.id] || { ...user, contexts: [] };
  const existingContext = find(userState.contexts, omit(context, ['connectedAt']));
  if (existingContext) return;
  Vue.set(state.users, user.id, {
    ...userState,
    contexts: [...userState.contexts, context]
  });
};

const end = (state, { user, context }) => {
  const userState = state.users[user.id];
  if (!userState) return;
  const contexts = userState.contexts.filter(it => !isContextEqual(it, context));
  Vue.set(state.users, user.id, { ...userState, contexts });
};

const endSession = (state, { sseId, userId }) => {
  const userState = state.users[userId];
  if (!userState) return;
  const contexts = userState.contexts.filter(it => it.sseId !== sseId);
  if (isEmpty(contexts)) return Vue.delete(state.users, userId);
  Vue.set(state.users, userId, { ...userState, contexts });
};

const reset = state => {
  state.users = {};
};

export {
  fetch,
  start,
  end,
  endSession,
  reset
};

function isContextEqual(sourceContext, targetContext) {
  const fields = ['sseId', 'repositoryId'];
  if (sourceContext.elementId) fields.push('elementId');
  if (sourceContext.activityId) fields.push('activityId');
  return isEqual(pick(sourceContext, fields), pick(targetContext, fields));
}
