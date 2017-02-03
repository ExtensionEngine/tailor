import filter from 'lodash/filter';

export function getChildren(activities, parentId, courseId) {
  return filter(activities, it => {
    return it.parentId === parentId && it.courseId === courseId;
  }).sort((a, b) => a.position > b.position);
}

export function updatePosition({ index, prev, next, first, count, sameLevel, reorder }) {
  let position;
  if (!sameLevel || (index === 0 && reorder) || index === -1) {
    position = first ? first.position * 0.5 : 1;
  } else if (index + 1 === count) {
    position = prev.position + 1;
  } else {
    position = (prev.position + next.position) * 0.5;
  }

  return position;
}
