import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import remove from 'lodash/remove';
import { setEndpoint } from '../../helpers/mutations';
import Vue from 'vue';

const save = (state, user) => {
  const { activeUsers } = state;
  user.contexts.forEach(context => {
    setUserActivity(Vue, activeUsers, user, context);
  });
};

const sseAdd = (state, { user, context }) => {
  const { activeUsers } = state;
  setUserActivity(Vue, activeUsers, user, context);
};

const sseRemove = (state, { user, context: sourceContext }) => {
  const existingUser = state.activeUsers[user.id];
  if (!existingUser) return;
  const index = existingUser.contexts.findIndex(targetContext => {
    return isContextEqual(sourceContext, targetContext);
  });
  if (index === -1) return;
  existingUser.contexts.splice(index, 1);
};

const sseRemoveSession = (state, { userId, sseId }) => {
  const existingUser = state.activeUsers[userId];
  if (!existingUser) return;
  remove(existingUser.contexts, c => c.sseId === sseId);
  if (isEmpty(existingUser.contexts)) {
    Vue.delete(state.activeUsers, userId);
  }
};

const setSseId = (state, sseId) => {
  state.sseId = sseId;
};

const resetActiveUsers = state => {
  state.activeUsers = {};
};

export {
  save,
  setEndpoint,
  setSseId,
  sseAdd,
  sseRemove,
  sseRemoveSession,
  resetActiveUsers
};

function setUserActivity(_vue, activeUsers, user, context) {
  const existingUser = activeUsers[user.id];
  if (!existingUser) {
    _vue.set(activeUsers, user.id, { ...user, contexts: [context] });
    return;
  }
  const existingContext = find(existingUser.contexts, omit(context, ['created']));
  if (existingContext) return;
  existingUser.contexts.push(context);
}

function isContextEqual(sourceContext, targetContext) {
  const fields = ['repositoryId', 'sseId'];
  if (sourceContext.elementId) fields.push('elementId');
  if (sourceContext.activityId) fields.push('activityId');
  return isEqual(pick(sourceContext, fields), pick(targetContext, fields));
}
