import { add, fetch, remove, reset, setEndpoint } from '../../helpers/mutations';
import findKey from 'lodash/findKey';
import Vue from 'vue';

const reorder = (state, { activity, position }) => {
  state.items[activity._cid].position = position;
};

const save = (state, activities) => {
  if (!Array.isArray(activities)) activities = [activities];
  activities.forEach(activity => {
    if (activity._cid) {
      return Vue.set(state.items, activity._cid, activity);
    }
    const _cid = findKey(state.items, { id: activity.id });
    Vue.set(state.items, _cid, { ...activity, _cid });
  });
};

export { add, fetch, remove, reorder, reset, save, setEndpoint };
