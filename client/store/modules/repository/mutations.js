import compact from 'lodash/compact';
import transform from 'lodash/transform';
import Vue from 'vue';

export const setRepositoryId = (state, repositoryId) => {
  state.repositoryId = repositoryId;
};

export const toggleActivity = (state, { uid, expanded }) => {
  const expandedItems = state.outline.expanded;
  expanded = expanded === undefined ? !expandedItems[uid] : expanded;
  Vue.set(expandedItems, uid, expanded);
};

export const expandParents = (state, parents) => {
  const expanded = transform(parents, (acc, it) => (acc[it.uid] = true), {});
  state.outline.expanded = { ...state.outline.expanded, ...expanded };
};

export const toggleActivities = (state, outline) => {
  const totalExpanded = compact(Object.values(state.outline.expanded)).length;
  const isOpen = totalExpanded < outline.length;
  const expanded = transform(outline, (acc, it) => (acc[it.uid] = isOpen), {});
  Vue.set(state.outline, 'expanded', expanded);
};

export const upsertUser = (state, user) => Vue.set(state.users, user.id, user);

export const removeUser = (state, id) => Vue.delete(state.users, id);

export const setUsers = (state, { items, total }) => {
  state.users = {};
  items.forEach(it => Vue.set(state.users, it.id, it));
  state.userCount = total;
};

export const setSseId = (state, sseId) => {
  state.sseId = sseId;
};
