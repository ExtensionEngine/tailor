import {
  add, fetch, remove, reset, save, setEndpoint
} from '@/store/helpers/mutations';
import Vue from 'vue';

const archive = (state, model) => {
  Vue.delete(state.items, model._cid);
};

export { fetch, add, archive, remove, reset, save, setEndpoint };
