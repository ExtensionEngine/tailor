import filter from 'lodash/filter';

export function getChildren(activities, parentId, courseId) {
  return filter(activities, it => {
    return it.parentId === parentId && it.courseId === courseId;
  }).sort((a, b) => a.position > b.position);
}

export function getDescendants(activities, activity) {
  const children = filter(activities, { parentId: activity.id });
  if (!children.length) return [];
  const descendants = children.reduce((acc, it) =>
    acc.concat(getDescendants(activities, it)), []);
  return children.concat(descendants);
}
