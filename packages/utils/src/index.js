import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import toCase from 'to-case';

export * from './calculatePosition';
export { default as InsertLocation } from './InsertLocation';
export * as assessment from './assessment';
export * as Events from './events';
export { default as publishDiffChangeTypes } from './publishDiffChangeTypes';
export { default as uuid } from './uuid';

export function getMetaName(type) {
  return `meta-${toCase.slug(type)}`;
}

export function getContainerName(type) {
  return `tcc-${toCase.slug(type)}`;
}

export function getComponentName(type) {
  return `tce-${toCase.slug(resolveElementType(type))}`;
}

export function processAnswerType(type) {
  return `answer-${toCase.slug(type)}`;
}

export function isQuestion(type) {
  return ['QUESTION', 'REFLECTION', 'ASSESSMENT'].includes(type);
}

export function resolveElementType(type) {
  return isQuestion(type) ? 'QUESTION-CONTAINER' : type;
}

export function getToolbarName(type) {
  return `${toCase.slug(type)}-toolbar`;
}

export function getElementId(element) {
  return element && (element.uid || element.id);
}

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

export function getOutlineChildren(activities, schema, parentId) {
  const children = getChildren(activities, parentId);
  if (!parentId || !children.length) return children;
  const types = schema.getLevel(find(activities, { id: parentId }).type).subLevels;
  return filter(children, it => types.includes(it.type));
}

export function toTreeFormat(activities, schema, targetLevels, parentId = null, level = 1) {
  return getOutlineChildren(activities, schema, parentId).map(activity => ({
    ...activity,
    name: activity.data.name,
    level,
    selectable: !!targetLevels.find(it => it.type === activity.type),
    children: toTreeFormat(activities, schema, targetLevels, activity.id, level + 1)
  }));
}
