import { lower, sentence } from 'to-case';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';
import { typeInfo } from './assessment';

const describe = {
  REPOSITORY: describeRepositoryRevision,
  ACTIVITY: describeActivityRevision,
  CONTENT_ELEMENT: describeElementRevision
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
  if (!activity) return '';
  const name = get(activity, 'data.name');
  const activityConfig = getLevel(activity.type);
  const typeLabel = !isEmpty(activityConfig)
    ? activityConfig.label
    : sentence(activity.type);
  return `within ${name} ${typeLabel}`;
}

function describeActivityRevision(rev, activity) {
  const { type } = rev.state;
  const activityConfig = getLevel(type);
  const label = !isEmpty(activityConfig) ? activityConfig.label : sentence(type);
  const name = get(rev, 'state.data.name', '');
  const action = getAction(rev.operation);
  const activityText = activityConfig.level !== 1
    ? getActivityText(activity)
    : '';
  return `${action} ${name} ${lower(label)} ${activityText}`;
}

function describeElementRevision(rev, activity) {
  const { type, data } = rev.state;
  const title = type === 'ASSESSMENT' ? typeInfo[data.type].title : type;
  const action = getAction(rev.operation);
  const activityText = activity
    ? getActivityText(activity)
    : 'within deleted container';
  return `${action} ${lower(title)} element ${activityText}`;
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
      return 'R';
    case 'CONTENT_ELEMENT':
      return 'CE';
    default:
      return 'N/A';
  }
}

export function getRevisionColor(rev) {
  const DEFAULT_COLOR = '#ccc';
  switch (rev.entity) {
    case 'ACTIVITY': {
      const level = getLevel(rev.state.type);
      return !isEmpty(level) ? level.color : DEFAULT_COLOR;
    }
    case 'REPOSITORY':
      return '#00BCD4';
    case 'CONTENT_ELEMENT':
      return '#FF5722';
    default:
      return DEFAULT_COLOR;
  }
}
