import filter from 'lodash/filter';

export function getChildren(activities, parentId, courseId) {
  return filter(activities, it => {
    return it.parentId === parentId && it.courseId === courseId;
  }).sort((a, b) => a.position > b.position);
}

export function getDescendants(activities, activity) {
  const children = filter(activities, { parentId: activity.id });
  if (!children.length) return [];
  const reducer = (acc, it) => acc.concat(getDescendants(activities, it));
  const descendants = children.reduce(reducer, []);
  return children.concat(descendants);
}
