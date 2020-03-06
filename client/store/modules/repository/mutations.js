import compact from 'lodash/compact';
import transform from 'lodash/transform';
import Vue from 'vue';

export const selectActivity = (state, _cid) => {
  state.activity = _cid;
};

export const toggleActivity = (state, { _cid, expanded }) => {
  const expandedItems = state.outline.expanded;
  expanded = expanded === undefined ? !expandedItems[_cid] : expanded;
  Vue.set(expandedItems, _cid, expanded);
};

export const expandParents = (state, parents) => {
  const expanded = transform(parents, (acc, it) => (acc[it._cid] = true), {});
  state.outline.expanded = expanded;
};

export const toggleActivities = (state, outline) => {
  const totalExpanded = compact(Object.values(state.outline.expanded)).length;
  const isOpen = totalExpanded < outline.length;
  const expanded = transform(outline, (acc, it) => (acc[it._cid] = isOpen), {});
  Vue.set(state.outline, 'expanded', expanded);
};

export const upsertUser = (state, user) => Vue.set(state.users, user.id, user);

export const removeUser = (state, id) => Vue.delete(state.users, id);

export const setUsers = (state, users) => {
  state.users = {};
  users.forEach(it => Vue.set(state.users, it.id, it));
};
