import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import sortBy from 'lodash/sortBy';

export function getParent(activities, activity) {
  const id = get(activity, 'parentId', null);
  return id && find(activities, { id });
}

export function getChildren(activities, parentId) {
  return sortBy(filter(activities, { parentId }), 'position');
}

export function getOutlineChildren(activities, parentId) {
  const children = getChildren(activities, parentId);
  if (!parentId || !children.length) return children;
  const types = getLevel(find(activities, { id: parentId }).type).subLevels;
  return filter(children, it => types.includes(it.type));
}

export function getDescendants(activities, activity) {
  const children = filter(activities, { parentId: activity.id });
  if (!children.length) return [];
  const reducer = (acc, it) => acc.concat(getDescendants(activities, it));
  const descendants = children.reduce(reducer, []);
  return children.concat(descendants);
}

export function getAncestors(activities, activity) {
  const parent = find(activities, { id: activity.parentId });
  if (!parent) return [];
  const ancestors = getAncestors(activities, parent);
  return [...ancestors, parent];
}

export function isSameLevel(activityX, activityY) {
  return getLevel(activityX.type).level === getLevel(activityY.type).level;
}

export function toTreeFormat(activities, targetLevels, parentId = null, level = 1) {
  return getOutlineChildren(activities, parentId).map(activity => ({
    ...activity,
    name: activity.data.name,
    level,
    selectable: !!targetLevels.find(it => it.type === activity.type),
    children: toTreeFormat(activities, targetLevels, activity.id, level + 1)
  }));
}
