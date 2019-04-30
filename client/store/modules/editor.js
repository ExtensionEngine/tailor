import filter from 'lodash/filter';
import find from 'lodash/find';
import { getSupportedContainers } from 'shared/activities';
import reduce from 'lodash/reduce';
import { VuexModule } from 'vuex-module';

const { getter, build } = new VuexModule('editor');

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
  const containers = getSupportedContainers(activity.type);
  return reduce(containers, (acc, { type }) => {
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

export default build();
