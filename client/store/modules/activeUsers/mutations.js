import find from 'lodash/find';
import { getUsedPalettes } from './getters';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import omit from 'lodash/omit';
import palette from 'utils/palette';
import remove from 'lodash/remove';
import sample from 'lodash/sample';
import Vue from 'vue';

export const save = (state, users) => {
  const { activeUsers } = state;
  map(users, (user) => {
    const usedPalettes = getUsedPalettes(state);
    user.contexts.forEach(context => {
      addContext(Vue, activeUsers, user, context, usedPalettes);
    });
  });
};

export const sseAdd = (state, { user, context }) => {
  const { activeUsers } = state;
  const usedPalettes = getUsedPalettes(state);
  addContext(Vue, activeUsers, user, context, usedPalettes);
};

export const sseRemove = (state, { user, context }) => {
  const existingUser = state.activeUsers[user.id];
  if (!existingUser) return;
  const index = existingUser.contexts.findIndex(c => {
    return isEqual(omit(c, ['created']), omit(context, ['created']));
  });
  if (index === -1) return;
  existingUser.contexts.splice(index, 1);
};

export const sseRemoveSession = (state, { userId, sseId }) => {
  const existingUser = state.activeUsers[userId];
  if (!existingUser) return;
  remove(existingUser.contexts, c => c.sseId === sseId);
  if (isEmpty(existingUser.contexts)) Vue.delete(state.activeUsers, userId);
};

export const setSseId = (state, { sseId }) => {
  state.sseId = sseId;
};

function addContext(_vue, activeUsers, user, context, usedPalettes) {
  const existingUser = activeUsers[user.id];
  if (!existingUser) {
    assignPalette(user, usedPalettes, activeUsers);
    _vue.set(activeUsers, user.id, { ...user, contexts: [context] });
    return;
  }
  const existingContext = find(existingUser.contexts, omit(context, ['created']));
  if (existingContext) return;
  existingUser.contexts.push(context);
}

function assignPalette(user, usedPalettes, activeUsers) {
  if (activeUsers[user.id]) return;
  const colorPalette = find(palette, p => !usedPalettes.includes(p.id)) ||
    sample(palette);
  user.palette = colorPalette;
}
