import {
  getDescendants as getDeepChildren,
  getAncestors as getParents
} from 'utils/activity';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';

export const activities = state => state.items;

export const getParent = state => {
  return id => {
    const activity = find(state.items, { id });
    return activity ? find(state.items, { id: activity.parentId }) : null;
  };
};

export const getDescendants = state => {
  return activity => getDeepChildren(state.items, activity);
};

export const getAncestors = state => {
  return activity => getParents(state.items, activity);
};

export const getLineage = state => {
  return activity => {
    const ancestors = getParents(state.items, activity);
    const descendants = getDeepChildren(state.items, activity);
    return [...ancestors, ...descendants];
  };
};

export const getExamObjectives = state => {
  const getObjectives = activity => {
    const config = getLevel(activity.type);
    const objectiveTypes = get(config, 'exams.objectives');
    if (!objectiveTypes) return [];
    const children = getDeepChildren(state.items, activity);
    return filter(children, it => objectiveTypes.includes(it.type));
  };

  return exam => getObjectives(find(state.items, { id: exam.parentId }));
};
