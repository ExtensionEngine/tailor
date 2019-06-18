import api from '../../api/activeUsers';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import omit from 'lodash/omit';
import palette from 'utils/palette';
import sample from 'lodash/sample';
import SSEClient from '../../SSEClient';
import Vue from 'vue';
import { VuexModule } from 'vuex-module';

const { build, getter, action, mutation, state } = new VuexModule('activeUsers');
let SSE_CLIENT;

state({
  activeUsers: {}
});

getter(function activeUsers() {
  let activeUsersMap = { course: {}, activity: {}, content: {} };
  Object.keys(this.state.activeUsers).forEach(userId => {
    this.state.activeUsers[userId].contexts.forEach(context => {
      mapContext(activeUsersMap, this.state.activeUsers[userId], context);
    });
  });
  return activeUsersMap;
});

getter(function usedPalettes() {
  return filter(map(this.state.activeUsers, user => get(user.palette, 'id', null)));
});

action(function subscribe(courseId) {
  if (SSE_CLIENT) SSE_CLIENT.disconnect();
  SSE_CLIENT = new SSEClient(`/api/v1/courses/${courseId}/active-users/subscribe`);
  SSE_CLIENT.subscribe('active_user_add', ({ user, context }) => {
    this.commit('sseAdd', { user, context });
  });
  SSE_CLIENT.subscribe('active_user_remove', ({ user, context }) => {
    this.commit('sseRemove', { user, context });
  });
});

action(function unsubscribe() {
  if (!SSE_CLIENT) return;
  SSE_CLIENT.disconnect();
});

action(function fetch(courseId) {
  return api.fetch(courseId)
    .then(({ activeUsers }) => this.commit('save', activeUsers));
});

action(function add(context) {
  return api.add(context);
});

action(function remove(context) {
  return api.remove(context);
});

mutation(function save(users) {
  const { activeUsers } = this.state;
  map(users, (user) => {
    const usedPalettes = this.getters['activeUsers/usedPalettes'];
    user.contexts.forEach(context => {
      addContext(Vue, activeUsers, user, context, usedPalettes);
    });
  });
});

mutation(function sseAdd({ user, context }) {
  const { activeUsers } = this.state;
  const usedPalettes = this.getters['activeUsers/usedPalettes'];
  addContext(Vue, activeUsers, user, context, usedPalettes);
});

mutation(function sseRemove({ user, context }) {
  const existingUser = this.state.activeUsers[user.id];
  if (!existingUser) return;
  const index = existingUser.contexts.findIndex(c => {
    return isEqual(omit(c, ['created']), omit(context, ['created']));
  });
  if (index === -1) return;
  existingUser.contexts.splice(index, 1);
});

function mapContext(activeUsers, user, context) {
  const { id, email, palette } = user;
  const { created } = context;
  const omittedFields = ['timer', 'created'];
  Object.keys(omit(context, omittedFields)).forEach(key => {
    const entityName = key.substring(0, key.length - 2);
    const entityId = context[key];
    if (activeUsers[entityName][entityId]) {
      const user = find(activeUsers[entityName][entityId], { id });
      if (user) return;
      activeUsers[entityName][entityId].push({ id, email, palette, created });
      return;
    }
    activeUsers[entityName][entityId] = [{ id, email, palette, created }];
  });
}

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

export default build();
