import { ASSET_GROUP } from 'shared/activities';
import filter from 'lodash/filter';
import find from 'lodash/find';
import { VuexModule } from 'vuex-module';

const { state, getter, action, mutation, build } = new VuexModule('editor');

state({
  focusedElement: null
});

getter(function focusedElement() {
  return this.state.focusedElement;
});

getter(function activity() {
  const { route } = this.rootState;
  const { activities } = this.rootGetters;
  const id = Number(route.params.activityId);
  return find(activities, { id });
});

getter(function perspectives() {
  const { route } = this.rootState;
  const { activities } = this.rootGetters;
  const parentId = Number(route.params.activityId);
  return filter(activities, { parentId, type: ASSET_GROUP });
});

getter(function assessments() {
  const { route } = this.rootState;
  const { tes } = this.rootGetters;
  const activityId = Number(route.params.activityId);
  return filter(tes, { activityId });
});

// TODO: Implement persistance upon focusout
action(function focusoutElement() {
  this.commit('focusElement');
});

mutation(function focusElement(element = {}) {
  this.state.focusedElement = element;
});

export default build();
