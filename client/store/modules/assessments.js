import cuid from 'cuid';
import each from 'lodash/each';
import cloneDeep from 'lodash/cloneDeep';
import VuexCollection from '../helpers/collection.js';
const { action, build, getter } = new VuexCollection('assessments');

const dataKeys = ['question', 'answers', 'correct', 'hint', 'image', 'areas', 'surfaceImage'];

function nest(model) {
  model.data = {};
  each(model, (v, k) => {
    if (dataKeys.includes(k)) {
      model.data[k] = v;
      delete model[k];
    }
  });
  return model;
}

function flatten(model) {
  each(model.data, (v, k) => { model[k] = v; });
  delete model.data;
  return model;
}

getter(function assessments() {
  return this.state.items;
}, { global: true });

action(function fetch(params = {}) {
  return this.api.fetch(params)
    .then(result => {
      each(result, flatten);
      this.commit('fetch', result);
    });
});

action(function save(model) {
  if (!model._cid) model._cid = cuid();
  model._synced = false;
  model._version = Date.now();

  // create or update model locally
  this.commit('save', model);

  const nested = nest(cloneDeep(model));
  return this.api.save(nested)
    .then(result => {
      model.id = result.id;
      // check if new change happened locally during api call
      // do not update meta if there is newer change
      const previous = this.context.state.items[model._cid];
      if (previous && previous._version === model._version) model._synced = true;
      this.commit('save', model);
    });
});

action(function update(model) {
  const cid = model._cid;
  const changes = nest(cloneDeep(model));
  delete changes._cid;
  return this.api.update(cid, changes)
    .then(updated => this.commit('update', flatten(updated)));
});

export default build();
