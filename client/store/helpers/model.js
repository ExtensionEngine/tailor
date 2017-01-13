import cuid from 'cuid';
import Vue from 'vue';
import { VuexModule } from 'vuex-module';

import Resource from '../../api/resource';

export default function (collectionName, url = '') {
  let module = new VuexModule(collectionName);

  Object.defineProperty(module, 'url', {
    get: () => module.api ? module.api.baseUrl : '',
    set: url => {
      module.api = new Resource(url);
    }
  });

  module.url = url;

  let { state, action, mutation } = module;

  state({
    items: {},
    $internals: {
      subscriptions: {}
    }
  });

  action(function fetch(params = {}) {
    return this.api.fetch(params)
      .then(result => this.commit('fetch', result));
  });

  action(function reset() {
    return this.api.fetch()
      .then(result => this.commit('reset', result));
  });

  action(function save(model) {
    if (!model._cid) model._cid = cuid();
    model._synced = false;
    model._version = Date.now();

    // create or update model locally
    this.commit('save', model);

    return this.api.save(model)
      .then(model => {
        // check if new change happened locally during api call
        // do not update meta if there is newer change
        const previous = this.context.state.items[model._cid];
        if (previous && previous._version === model._version) model._synced = true;
        this.commit('save', model);
      });
  });

  action(function remove(model) {
    return this.api.remove(model)
      .then(removed => this.commit('remove', removed));
  });

  // TODO: Do the proper syncing
  mutation(function fetch(result) {
    this.state.items = result;
  });

  mutation(function reset(result) {
    this.state.items = result;
  });

  mutation(function add(model) {
    if (!model._cid) model._cid = cuid();
    Vue.set(this.state.items, model._cid, model);
  });

  mutation(function save(model) {
    Vue.set(this.state.items, model._cid, model);
  });

  mutation(function remove(result) {
    result.forEach(it => Vue.delete(this.state.items, it._cid));
  });

  return module;
};
