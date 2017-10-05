import { getLevel } from 'shared/activities';
import { lower } from 'to-case';
import reduce from 'lodash/reduce';
import { typeInfo } from './assessment';

const describe = {
  'COURSE': describeCourseRevision,
  'ACTIVITY': describeActivityRevision,
  'TEACHING_ELEMENT': describeElementRevision
};

function getAction(operation) {
  switch (operation) {
    case 'CREATE':
      return 'Created';
    case 'REMOVE':
      return 'Removed';
    case 'UPDATE':
    default:
      return 'Changed';
  }
}

function describeActivityRevision(rev) {
  let { name, type } = rev.state;
  name = name ? ` "${name}"` : '';
  const level = getLevel(type);
  const label = level ? level.label : type;
  return `${getAction(rev.operation)} ${lower(label)}${name}`;
}

function describeElementRevision(rev) {
  const { type, data } = rev.state;
  const title = type === 'ASSESSMENT' ? typeInfo[data.type].title : type;
  return `${getAction(rev.operation)} ${lower(title)} element`;
}

function describeCourseRevision(rev) {
  return `${getAction(rev.operation)} course`;
}

export function getFormatDescription(rev) {
  return describe[rev.entity](rev);
}

export function getRevisionAcronym(rev) {
  switch (rev.entity) {
    case 'ACTIVITY':
      const typeArray = rev.state.type.split('_', 2);
      const acronym = reduce(typeArray, (acc, val) => acc + val.charAt(0), '');
      return acronym;
    case 'COURSE':
      return 'C';
    case 'TEACHING_ELEMENT':
      return 'TE';
    default:
      return 'N/A';
  }
}

export function getRevisionColor(rev) {
  const DEFAULT_COLOR = '#808080';
  switch (rev.entity) {
    case 'ACTIVITY':
      const level = getLevel(rev.state.type);
      return level ? level.color : DEFAULT_COLOR;
    case 'COURSE':
      return '#00BCD4';
    case 'TEACHING_ELEMENT':
      return '#FF5722';
    default:
      return DEFAULT_COLOR;
  }
}
