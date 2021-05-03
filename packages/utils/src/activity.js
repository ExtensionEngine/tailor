import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

export function isChanged(activity) {
  return !activity.publishedAt ||
    (new Date(activity.modifiedAt) > new Date(activity.publishedAt));
}

export function getParent(activities, activity) {
  const id = get(activity, 'parentId', null);
  return id && find(activities, { id });
}

export function getChildren(activities, parentId) {
  return sortBy(filter(activities, { parentId }), 'position');
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

export function getOutlineChildren(activities, parentId, schema) {
  const children = getChildren(activities, parentId);
  if (!parentId || !children.length) return children;
  const parentType = find(activities, { id: parentId }).type;
  const types = schema.getLevel(parentType).subLevels;
  return filter(children, it => types.includes(it.type));
}

export function getOutlineTree(activities, schema, options = {}) {
  return toTreeFormat(activities, schema, { filterFn: getOutlineChildren, ...options });
}

export function toTreeFormat(activities, schema, {
  filterFn = getChildren,
  parentId = null,
  level = 1,
  maxLevel = 20
}) {
  if (level > maxLevel) return [];
  return filterFn(activities, parentId, schema).map(activity => ({
    ...activity,
    name: activity.data.name,
    level,
    selectable: schema.isEditable(activity.type),
    children: toTreeFormat(activities, schema, {
      filterFn,
      parentId: activity.id,
      level: level + 1,
      maxLevel
    })
  }));
}
