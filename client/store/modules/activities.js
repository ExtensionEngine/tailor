import calculatePosition from 'utils/calculatePosition.js';
import filter from 'lodash/filter';
import find from 'lodash/find';
import { getDescendants as getDeepChildren } from '../../utils/activity.js';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import { OUTLINE_LEVELS } from 'shared/activities';
import reduce from 'lodash/reduce';
import VuexCollection from '../helpers/collection.js';

const { getter, action, mutation, build } = new VuexCollection('activities');

getter(function activities() {
  return this.state.items;
}, { global: true });

getter(function getParent() {
  return activityId => {
    const activity = find(this.state.items, { id: activityId });
    return activity ? find(this.state.items, { id: activity.parentId }) : null;
  };
});

getter(function getDescendants() {
  return activity => getDeepChildren(this.state.items, activity);
});

getter(function getExamObjectives() {
  const getChildren = activity => {
    let condition = it => it.parentId === activity.id && it.type !== 'EXAM';
    return filter(this.state.items, condition);
  };

  const getOutlineLeafs = (items, leafType = last(OUTLINE_LEVELS).type) => {
    if (isEmpty(items)) return [];
    if (items[0].type === leafType) return items;
    items = reduce(items, (acc, it) => acc.concat(getChildren(it)), []);
    return getOutlineLeafs(items, leafType);
  };

  return exam => getOutlineLeafs([find(this.state.items, { id: exam.parentId })]);
});

action(function reorder({ activity, context }) {
  this.commit('reorder', { activity, position: calculatePosition(context) });
  const data = { position: context.newPosition };
  return this.api.post(`${activity.id}/reorder`, data)
    .then(res => {
      let activity = res.data.data;
      this.api.setCid(activity);
      this.commit('save', activity);
    });
});

mutation(function reorder({ activity, position }) {
  activity.position = position;
});

export default build();
