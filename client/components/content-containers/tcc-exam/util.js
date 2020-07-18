const filter = require('lodash/filter');
const info = require('./info');
const pick = require('lodash/pick');
const Promise = require('bluebird');

const ATTRS = [
  'id', 'uid', 'type', 'position', 'parentId', 'createdAt', 'updatedAt'
];

async function fetchGroups(exam, { include }) {
  const groups = await exam.getChildren({ include });
  return {
    ...pick(exam, ATTRS),
    groups: groups.map(group => ({
      ...pick(group, ['id', 'uid', 'type', 'position', 'data', 'createdAt']),
      intro: filter(group.ContentElements, it => it.type !== 'ASSESSMENT'),
      assessments: filter(group.ContentElements, { type: 'ASSESSMENT' })
    }))
  };
}

function fetch(parent, childOptions) {
  const opts = { where: { type: 'EXAM' } };
  return parent.getChildren(opts).map(exam => fetchGroups(exam, childOptions));
}

async function resolve(exam, resolveStatics) {
  exam.groups = await Promise.map(exam.groups, async group => {
    group.intro = await Promise.map(group.intro, resolveStatics);
    group.assessments = await Promise.map(group.assessments, resolveStatics);
    return group;
  });
  return exam;
}

module.exports = {
  ...info,
  fetch,
  resolve,
  publishedAs: 'exam'
};
