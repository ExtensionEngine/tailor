import { ASSET_GROUP } from 'shared/activities';
import filter from 'lodash/filter';
import find from 'lodash/find';
import toArray from 'lodash/toArray';
import { VuexModule } from 'vuex-module';

const { state, getter, action, mutation, build } = new VuexModule('editor');

state({
  focusedElement: null
});

getter(function focusedElement() {
  if (!this.state.focusedElement.id) return {};
  const id = this.state.focusedElement.id;
  const tes = toArray(this.rootGetters.tes);
  let element;
  for (let i = 0; i < tes.length; i++) {
    if (tes[i].id === id) {
      element = tes[i];
      break;
    }
    if (tes[i].data.embeds) {
      const embeds = toArray(tes[i].data.embeds);
      for (let j = 0; j < embeds.length; j++) {
        if (embeds[j].id === id) {
          element = embeds[j];
          break;
        }
      }
    }
  }

  return element;
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
