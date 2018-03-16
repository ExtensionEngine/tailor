import calculatePosition from 'utils/calculatePosition.js';
import filter from 'lodash/filter';
import find from 'lodash/find';
import {
  getDescendants as getDeepChildren,
  getAncestors as getParents
} from 'utils/activity.js';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import request from '../../api/request';
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

getter(function getAncestors() {
  return activity => getParents(this.state.items, activity);
});

getter(function getLineage() {
  return activity => {
    const ancestors = getParents(this.state.items, activity);
    const descendants = getDeepChildren(this.state.items, activity);
    return [...ancestors, ...descendants];
  };
});

getter(function getExamObjectives() {
  const getObjectives = activity => {
    const config = getLevel(activity.type);
    const objectiveTypes = get(config, 'exams.objectives');
    if (!objectiveTypes) return [];
    let children = getDeepChildren(this.state.items, activity);
    return filter(children, it => objectiveTypes.includes(it.type));
  };

  return exam => getObjectives(find(this.state.items, { id: exam.parentId }));
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

action(function clone(activity) {
  const { srcId, srcCourseId } = activity;
  const url = `/courses/${srcCourseId}/activities/${srcId}/clone`;
  return request.post(url, activity)
    .then(({ data: { data } }) => this.commit('fetch', data));
});

action(function publish(activity) {
  const { id, courseId } = activity;
  const url = `/courses/${courseId}/activities/${id}/publish`;
  return request.get(url).then(({ data: { data } }) => {
    this.commit('save', { ...activity, publishedAt: data.publishedAt });
  });
});

mutation(function reorder({ activity, position }) {
  activity.position = position;
});

export default build();
