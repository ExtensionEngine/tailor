import { add, fetch, remove, reset, setEndpoint } from '../../helpers/mutations';
import cuid from 'cuid';
import findKey from 'lodash/findKey';
import Vue from 'vue';

const reorder = (state, { activity, position }) => {
  state.items[activity._cid].position = position;
};

const save = (state, model) => {
  if (Array.isArray(model)) return saveModels(state, model);
  if (model.links && model.links.length) saveModels(state, model.links);
  Vue.set(state.items, model._cid, model);
};

const saveModels = (state, models) => {
  models.forEach(link => {
    let _cid = findKey(state.items, { id: link.id, parentId: link.parentId });
    if (!_cid) _cid = cuid();
    Vue.set(state.items, _cid, { ...link, _cid });
  });
};

const removeLink = (state, { ids, updatedActivities }) => {
  ids.forEach(id => {
    const _cid = findKey(state.items, { id });
    if (!_cid) return;
    Vue.delete(state.items, _cid);
  });

  if (updatedActivities && updatedActivities.length) {
    updatedActivities.forEach(origin => {
      let _cid = findKey(state.items, { id: origin.id, parentId: origin.parentId });
      if (!_cid) _cid = cuid();
      Vue.set(state.items, _cid, { ...origin, _cid });
    });
  }
};

export { add, fetch, remove, removeLink, reorder, reset, save, setEndpoint };
