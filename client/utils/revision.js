import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import { lower } from 'to-case';
import reduce from 'lodash/reduce';
import { typeInfo } from './assessment';

const describe = {
  REPOSITORY: describeRepositoryRevision,
  ACTIVITY: describeActivityRevision,
  TEACHING_ELEMENT: describeElementRevision
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

function getActivityText(activity) {
  return activity ? ` within '${activity.data.name}' ${lower(activity.label)}` : '';
}

function describeActivityRevision(rev, activity) {
  const { type } = rev.state;
  let name = get(rev, 'state.data.name');
  name = name ? `'${name}' ` : '';
  const level = getLevel(type);
  const label = level ? level.label : type;
  const action = getAction(rev.operation);
  const activityText = getActivityText(activity);
  return `${action} ${name}${lower(label)}${activityText}`;
}

function describeElementRevision(rev, activity) {
  const { type, data } = rev.state;
  const title = type === 'ASSESSMENT' ? typeInfo[data.type].title : type;
  const action = getAction(rev.operation);
  const activityText = getActivityText(activity);
  return `${action} ${lower(title)} element${activityText}`;
}

function describeRepositoryRevision(rev) {
  return `${getAction(rev.operation)} repository`;
}

export function isSameInstance(a, b) {
  return (a.entity === b.entity) && (a.state.id === b.state.id);
}

export function getFormatDescription(rev, activity) {
  return describe[rev.entity](rev, activity);
}

export function getRevisionAcronym(rev) {
  switch (rev.entity) {
    case 'ACTIVITY': {
      const typeArray = rev.state.type.split('_', 2);
      return reduce(typeArray, (acc, val) => acc + val.charAt(0), '');
    }
    case 'REPOSITORY':
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
    case 'ACTIVITY': {
      const level = getLevel(rev.state.type);
      return level ? level.color : DEFAULT_COLOR;
    }
    case 'REPOSITORY':
      return '#00BCD4';
    case 'TEACHING_ELEMENT':
      return '#FF5722';
    default:
      return DEFAULT_COLOR;
  }
}
