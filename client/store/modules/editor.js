import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getSupportedContainers } from 'shared/activities';
import reduce from 'lodash/reduce';
import { VuexModule } from 'vuex-module';

const { getter, build } = new VuexModule('editor');

getter(function activity() {
  const id = parseInt(get(this.rootState, 'route.params.activityId'), 10);
  return find(this.rootGetters.activities, { id });
});

getter(function contentContainers() {
  const { activities } = this.rootGetters;
  const activity = this.getters['editor/activity'];
  if (!activity) return;
  const containers = getSupportedContainers(activity.type);
  return reduce(containers, (acc, { type }) => {
    acc[type] = filter(activities, { parentId: activity.id, type });
    return acc;
  }, {});
});

getter(function assessments() {
  const { tes } = this.rootGetters;
  const activity = this.getters['editor/activity'];
  if (!activity) return;
  return filter(tes, { activityId: activity.id, type: 'ASSESSMENT' });
});

export default build();
