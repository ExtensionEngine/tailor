const get = require('lodash/get');

const COURSE_COLORS = ['#689F38', '#FF5722', '#2196F3'];

export function getColor(course) {
  const meta = get(course, 'data.color');
  return meta || COURSE_COLORS[(course.id || 0) % 3];
}

export function getAcronym(name) {
  const reducer = (acc, it) => it ? `${acc}${it[0].toUpperCase()}` : acc;
  return name.split(/\s/).reduce(reducer, '').substr(0, 2);
}
