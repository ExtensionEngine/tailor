import filter from 'lodash/filter';
import find from 'lodash/find';
import { VuexModule } from 'vuex-module';

const { state, getter, action, mutation, build } = new VuexModule('atom');

state({
  focusedAsset: null
});

getter(function activity() {
  const { route } = this.rootState;
  const { activities } = this.rootGetters;
  return find(activities, { _key: route.params.activityKey });
});

getter(function perspectives() {
  const { route } = this.rootState;
  const { activities } = this.rootGetters;
  return filter(activities, { parentKey: route.params.activityKey });
});

getter(function assessments() {
  const { route } = this.rootState;
  const { assessments: collection } = this.rootGetters;
  return filter(collection, { activityKey: route.params.activityKey });
});

getter(function focusedAsset() {
  const { assets } = this.rootGetters;
  return assets[this.state.focusedAsset];
});

// TODO: Implement persistance upon focusout
action(function focusoutAsset() {
  this.commit('focusAsset');
});

mutation(function focusAsset(asset = {}) {
  this.state.focusedAsset = asset._cid;
});

export default build();
