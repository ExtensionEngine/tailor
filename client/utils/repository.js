import get from 'lodash/get';

const REPOSITORY_COLORS = ['#689F38', '#FF5722', '#2196F3'];

export function getColor(repository) {
  const meta = get(repository, 'data.color');
  return meta || REPOSITORY_COLORS[(repository.id || 0) % 3];
}

export function getAcronym(name) {
  const reducer = (acc, it) => it ? `${acc}${it[0].toUpperCase()}` : acc;
  return name.split(/\s/).reduce(reducer, '').substr(0, 2);
}
