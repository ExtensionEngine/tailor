import filter from 'lodash/filter';
import find from 'lodash/find';
import { VuexModule } from 'vuex-module';
import { ASSET_GROUP } from 'shared/activities';

const { state, getter, action, mutation, build } = new VuexModule('atom');

state({
  focusedAsset: null
});

getter(function activity() {
  const { route } = this.rootState;
  const { activities } = this.rootGetters;
  const id = Number(route.params.activityKey);
  return find(activities, { id });
});

getter(function perspectives() {
  const { route } = this.rootState;
  const { activities } = this.rootGetters;
  const parentId = Number(route.params.activityKey);
  return filter(activities, { parentId, type: ASSET_GROUP });
});

getter(function assessments() {
  const { route } = this.rootState;
  const { assessments: collection } = this.rootGetters;
  const activityId = Number(route.params.activityKey);
  return filter(collection, { activityId });
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
