import cuid from 'cuid';
import Vue from 'vue';
import { VuexModule } from 'vuex-module';

const { state, getter, action, mutation, build } = new VuexModule('atom');

// TODO: WIP version; location and structure
// will change upon BE integration and should be much flatter
state({
  perspectives: {
    items: {}
  },
  assets: {
    focused: null,
    items: {}
  },
  assessments: {
    items: {}
  }
});

// TODO: WIP version; Temporary getters
getter(function perspectives() {
  return this.state.perspectives.items;
});

getter(function assets() {
  return this.state.assets.items;
});

getter(function assessments() {
  return this.state.assessments.items;
});

getter(function focusedAsset() {
  const { items, focused } = this.state.assets;
  return items[focused];
});

// TODO: Implement persistance upon focusout
action(function focusoutAsset() {
  this.commit('focusAsset', null);
});

action(function createPerspective() {
  const model = { _cid: cuid() };
  this.commit('createPerspective', model);
});

action(function createAsset() {
  const model = { _cid: cuid() };
  this.commit('createAsset', model);
});

action(function createAssessment() {
  const model = { _cid: cuid() };
  this.commit('createAssessment', model);
});

mutation(function createPerspective(model) {
  Vue.set(this.state.perspectives.items, model._cid, model);
});

mutation(function createAsset(model) {
  Vue.set(this.state.assets.items, model._cid, model);
});

mutation(function createAssessment(model) {
  Vue.set(this.state.assessment.items, model._cid, model);
});

mutation(function focusAsset(assset) {
  this.state.assets.focused = assset._cid;
});

export default build();
