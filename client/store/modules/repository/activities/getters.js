import {
  getDescendants as getDeepChildren,
  getAncestors as getParents
} from '@tailor/utils';
import find from 'lodash/find';

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
