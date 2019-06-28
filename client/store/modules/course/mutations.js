import compact from 'lodash/compact';
import transform from 'lodash/transform';
import Vue from 'vue';

export const upsertUser = (state, user) => Vue.set(state.users, user.id, user);

export const removeUser = (state, id) => Vue.delete(state.users, id);

export const setUsers = (state, users) => {
  state.users = {};
  users.forEach(it => Vue.set(state.users, it.id, it));
};

export const toggleActivities = (state, outline) => {
  const totalExpanded = compact(Object.values(state.outline.expanded)).length;
  const isOpen = totalExpanded < outline.length;
  const expanded = transform(outline, (acc, it) => (acc[it._cid] = isOpen), {});
  Vue.set(state.outline, 'expanded', expanded);
};

export const toggleActivity = (state, { _cid, expanded }) => {
  let expandedItems = state.outline.expanded;
  expanded = expanded === undefined ? !expandedItems[_cid] : expanded;
  Vue.set(expandedItems, _cid, expanded);
};

export const showActivityOptions = (state, _cid) => {
  state.outline.showOptions = _cid;
};

export const focusActivity = (state, _cid) => {
  state.activity = _cid;
};
