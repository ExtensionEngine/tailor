import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import omit from 'lodash/omit';
import remove from 'lodash/remove';
import { setEndpoint } from '../../helpers/mutations';
import Vue from 'vue';

const save = (state, users) => {
  const { activeUsers } = state;
  map(users, user => {
    user.contexts.forEach(context => {
      setUserActivity(Vue, activeUsers, user, context);
    });
  });
};

const sseAdd = (state, { user, context }) => {
  const { activeUsers } = state;
  setUserActivity(Vue, activeUsers, user, context);
};

const sseRemove = (state, { user, context }) => {
  const existingUser = state.activeUsers[user.id];
  if (!existingUser) return;
  const index = existingUser.contexts.findIndex(c => {
    return isEqual(omit(c, ['created']), omit(context, ['created']));
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

export {
  save,
  setEndpoint,
  setSseId,
  sseAdd,
  sseRemove,
  sseRemoveSession
};

function setUserActivity(_vue, activeUsers, user, context, usedPalettes) {
  const existingUser = activeUsers[user.id];
  if (!existingUser) {
    _vue.set(activeUsers, user.id, { ...user, contexts: [context] });
    return;
  }
  const existingContext = find(existingUser.contexts, omit(context, ['created']));
  if (existingContext) return;
  existingUser.contexts.push(context);
}
