import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import remove from 'lodash/remove';
import Vue from 'vue';

const setSseId = (state, sseId) => {
  state.sseId = sseId;
};

const fetch = (state, users) => {
  state.users = users;
};

const start = (state, { user, context }) => {
  setContext(state.users, user, context);
};

const end = (state, { user, context }) => {
  const userState = state.users[user.id];
  if (!userState) return;
  const index = userState.contexts.findIndex(it => isContextEqual(it, context));
  if (index === -1) return;
  userState.contexts.splice(index, 1);
};

const endSession = (state, { sseId, userId }) => {
  const userState = state.users[userId];
  if (!userState) return;
  remove(userState.contexts, { sseId });
  if (isEmpty(userState.contexts)) Vue.delete(state.users, userId);
};

const reset = state => {
  state.users = {};
};

export {
  setSseId,
  fetch,
  start,
  end,
  endSession,
  reset
};

function setContext(activeUsers, user, context) {
  const existingUser = activeUsers[user.id];
  if (!existingUser) {
    Vue.set(activeUsers, user.id, { ...user, contexts: [context] });
    return;
  }
  const existingContext = find(existingUser.contexts, omit(context, ['createdAt']));
  if (existingContext) return;
  existingUser.contexts.push(context);
}

function isContextEqual(sourceContext, targetContext) {
  const fields = ['sseId', 'repositoryId'];
  if (sourceContext.elementId) fields.push('elementId');
  if (sourceContext.activityId) fields.push('activityId');
  return isEqual(pick(sourceContext, fields), pick(targetContext, fields));
}
