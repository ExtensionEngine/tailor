import cuid from 'cuid';
import each from 'lodash/each';
import Resource from '../../api/resource';

import Vue from 'vue';
import { VuexModule } from 'vuex-module';

export default function (collectionName, baseUrl = '') {
  let module = new VuexModule(collectionName);

  let { state, action, mutation } = module;

  state({
    items: {},
    $internals: {},
    $baseUrl: baseUrl
  });

  const getBaseUrl = () => module.state.$baseUrl;
  module.api = new Resource(getBaseUrl);

  action(function get(id) {
    return this.api.getById(id)
      .then(result => this.commit('save', result));
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
    // If added locally; not waiting for id (add)
    if (!model.id && !model._version) {
      this.commit('remove', [model]);
      return Promise.resolve(true);
    }

    return this.api.remove(model)
      .then(removed => this.commit('remove', removed));
  });

  action(function update(model) {
    const cid = model._cid;
    const changes = { ...model };
    delete changes._cid;
    return this.api.update(cid, changes)
      .then(updated => this.commit('update', updated));
  });

  // TODO: Do the proper syncing
  mutation(function fetch(result) {
    each(result, it => {
      this.api.setCid(it);
      Vue.set(this.state.items, it._cid, it);
    });
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

  mutation(function update(model) {
    Vue.set(this.state.items, model._cid, model);
  });

  // TODO: Fix state extend in order to nest $baseUrl
  // within $internals
  mutation(function setBaseUrl(url) {
    this.state.$baseUrl = url;
  });

  return module;
}
