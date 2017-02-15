import filter from 'lodash/filter';

export function getChildren(activities, parentId, courseId) {
  return filter(activities, it => {
    return it.parentId === parentId && it.courseId === courseId;
  }).sort((a, b) => a.position > b.position);
}
