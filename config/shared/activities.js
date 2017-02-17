import find from 'lodash/find';
import isNumber from 'lodash/isNumber';

const ASSET_GROUP = 'PERSPECTIVE';
const OUTLINE_LEVELS = [{
  type: 'GOAL',
  color: '#42A5F5',
  isEditable: true
}, {
  type: 'OBJECTIVE',
  color: '#66BB6A',
  isEditable: false
}, {
  type: 'TOPIC',
  color: '#EC407A',
  isEditable: true
}];

/**
 * Check if editor can be launched for provided activity level.
 * @param {string|number} level - Level type or depth
 * @return {boolean}
 */
function isEditable(level) {
  level = isNumber(level) ? level - 1 : find(OUTLINE_LEVELS, { type: level });
  return OUTLINE_LEVELS[level].isEditable;
}

module.exports = {
  OUTLINE_LEVELS,
  ASSET_GROUP,
  isEditable
};
