import { supportedContainers } from 'shared/activities';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import { VuexModule } from 'vuex-module';

const { state, getter, action, mutation, build } = new VuexModule('editor');

function findEmbeddedElement(tes, id) {
  const embedsKey = `data.embeds`;
  const questionKey = `data.question`;
  const getEmbed = it => find(get(it, embedsKey) || get(it, questionKey), { id });
  return getEmbed(find(tes, it => getEmbed(it)));
}

state({
  focusedElement: null
});

getter(function focusedElement() {
  const focused = this.state.focusedElement;
  if (!focused || !focused.id) return {};
  const tes = this.rootGetters.tes;
  const id = focused.id;

  return !focused.embedded
    ? find(tes, { id })
    : findEmbeddedElement(tes, id);
});

getter(function activity() {
  const { route } = this.rootState;
  const { activities } = this.rootGetters;
  const id = Number(route.params.activityId);
  return find(activities, { id });
});

getter(function contentContainers() {
  const { route } = this.rootState;
  const { activities } = this.rootGetters;
  const activityId = Number(route.params.activityId);
  const activity = find(activities, { id: activityId });

  if (!activity) return;
  const containers = supportedContainers(activity.type);
  return reduce(containers, (acc, type) => {
    acc[type] = filter(activities, { parentId: activityId, type });
    return acc;
  }, {});
});

getter(function assessments() {
  const { route } = this.rootState;
  const { tes } = this.rootGetters;
  const activityId = Number(route.params.activityId);
  return filter(tes, { activityId, type: 'ASSESSMENT' });
});

// TODO: Implement persistance upon focusout
action(function focusoutElement() {
  this.commit('focusElement');
});

mutation(function focusElement(element = {}) {
  this.state.focusedElement = element;
});

export default build();
