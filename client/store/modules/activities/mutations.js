import { add, fetch, remove, reset, setEndpoint } from '../../helpers/mutations';
import cuid from 'cuid';
import findKey from 'lodash/findKey';
import Vue from 'vue';

const reorder = (state, { activity, position }) => {
  state.items[activity._cid].position = position;
};

const save = (state, model) => {
  if (model.links && model.links.length) {
    model.links.forEach(link => {
      let _cid = findKey(state.items, { id: link.id });
      if (!_cid) _cid = cuid();
      Vue.set(state.items, _cid, { ...link, _cid });
    });
  }
  Vue.set(state.items, model._cid, model);
};

export { add, fetch, remove, reorder, reset, save, setEndpoint };
