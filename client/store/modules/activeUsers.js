import courseApi from '../../api/activeUsers';
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
      mapActiveUserContext(activeUsersMap, this.state.activeUsers[userId], context);
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
    this.commit('sseAddActiveUser', { user, context });
  });
  SSE_CLIENT.subscribe('active_user_remove', ({ user, context }) => {
    this.commit('sseRemoveActiveUser', { user, context });
  });
});

action(function unsubscribe() {
  if (!SSE_CLIENT) return;
  SSE_CLIENT.disconnect();
});

action(function getActiveUsers() {
  const courseId = get(this.rootState, 'route.params.courseId');
  if (!courseId) return;
  return courseApi.getActiveUsers(courseId)
    .then(({ activeUsers }) => this.commit('setActiveUsers', activeUsers));
});

mutation(function setActiveUsers(users) {
  Object.keys(users).forEach(id => {
    if (this.state.activeUsers[id]) {
      // TODO: Check if contexts exists
      Vue.set(this.state.activeUsers[id], 'contexts', users[id].contexts);
      return;
    }
    const usedPalettes = this.getters['activeUsers/usedPalettes'];
    assignPalette(users[id], usedPalettes, this.state.activeUsers);
    Vue.set(this.state.activeUsers, id, users[id]);
  });
});

mutation(function sseAddActiveUser({ user, context }) {
  const { activeUsers } = this.state;
  if (!activeUsers[user.id]) {
    if (!this.getters) return;
    const usedPalettes = this.getters['activeUsers/usedPalettes'];
    assignPalette(user, usedPalettes, this.state.activeUsers);
    Vue.set(activeUsers, user.id, { ...user, contexts: [context] });
    return;
  }
  const existingContext = find(activeUsers[user.id].contexts, context);
  if (existingContext) return;
  activeUsers[user.id].contexts.push(context);
});

mutation(function sseRemoveActiveUser({ user, context }) {
  if (!this.state.activeUsers[user.id]) return;
  const index = this.state.activeUsers[user.id].contexts.findIndex(c => {
    return isEqual(c, context);
  });
  if (index === -1) return;
  this.state.activeUsers[user.id].contexts.splice(index, 1);
});

function mapActiveUserContext(activeUsers, user, context) {
  const { id, email, palette, created } = user;
  Object.keys(omit(context, ['timer'])).forEach(key => {
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

function assignPalette(user, usedPalettes, activeUsers) {
  if (activeUsers[user.id]) return;
  const colorPalette = find(palette, p => !usedPalettes.includes(p.id)) ||
    sample(palette);
  user.palette = colorPalette;
}

export default build();
