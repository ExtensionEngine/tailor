const filter = require('lodash/filter');
const map = require('lodash/map');
const pick = require('lodash/pick');

const ATTRS = [
  'id', 'uid', 'type', 'position', 'parentId', 'createdAt', 'updatedAt'
];

async function fetchGroups(exam, { include }) {
  const groups = await exam.getChildren({ include });
  return {
    ...pick(exam, ATTRS),
    groups: map(groups, group => ({
      ...pick(group, ['id', 'uid', 'type', 'position', 'data', 'createdAt']),
      intro: filter(group.TeachingElements, it => it.type !== 'ASSESSMENT'),
      assessments: filter(group.TeachingElements, { type: 'ASSESSMENT' })
    }))
  };
}

function fetch(parent, childOptions) {
  const opts = { where: { type: 'EXAM' } };
  return parent.getChildren(opts).map(exam => fetchGroups(exam, childOptions));
}

module.exports = {
  fetch,
  publishedAs: 'exam'
};
