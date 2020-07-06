import {
  getDescendants as getDeepChildren,
  getOutlineChildren,
  getAncestors as getParents
} from 'utils/activity';
import calculatePosition from 'utils/calculatePosition';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

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

export const calculateInsertPosition = state => {
  return (activity, anchor) => {
    const items = getOutlineChildren(state.items, activity.parentId);
    const newPosition = anchor ? findIndex(items, { id: anchor.id }) : 1;
    const isFirstChild = !anchor ||
      (activity.parentId !== anchor.parentId) ||
      newPosition === -1;
    const context = { items, newPosition, isFirstChild, insert: true };
    return calculatePosition(context);
  };
};
