const filter = require('lodash/filter');
const find = require('lodash/find');
const findIndex = require('lodash/findIndex');
const get = require('lodash/get');
const map = require('lodash/map');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const storage = require('../shared/storage');

function publishActivity(activity) {
  return getStructureData(activity).then(data => {
    let { repository, predecessors, descendants, spine } = data;
    predecessors.forEach(it => {
      const exists = find(spine.structure, { id: it.id });
      if (!exists) spine.structure.push(it);
    });
    descendants.forEach(it => addToSpine(spine, it));
    addToSpine(spine, activity.dataValues);
    return publishContent(repository, activity).then(content => {
      const spineData = Buffer.from(JSON.stringify(spine), 'utf8');
      const key = `repository/${repository.id}/index.json`;
      return storage.saveFile(key, spineData);
    });
  });
}

function getStructureData(activity) {
  const repoData = activity.getCourse().then(repository => {
    return repository.getPublishedStructure()
      .then(spine => ({ repository, spine }));
  });
  return Promise.all([repoData, activity.predecessors(), activity.descendants()])
    .spread(({ repository, spine }, predecessors, descendants) => ({
      repository,
      predecessors,
      descendants: filter(descendants.leaves, it => it.id !== activity.id),
      spine
    }));
}

function publishContent(repository, activity) {
  const config = find(repository.getSchemaConfig().structure, pick(activity, 'type'));
  const containerTypes = get(config, 'contentContainers', []);
  return Promise.all([
    publishContainers(activity, containerTypes),
    publishExams(activity),
    publishAssessments(activity)
  ]).spread((containers, exams, assessments) => ({ containers, exams, assessments }));
}

function publishContainers(parent, types) {
  return parent.getChildren({ where: { type: { $in: types } } })
    .then(containers => Promise.map(containers, fetchContainer))
    .then(containers => Promise.map(containers, it => {
      return saveFile(parent, `${it.id}.container`, it).then(() => it);
    }));
}

function publishExams(parent) {
  return fetchExams(parent).then(exams => Promise.map(exams, exam => {
    return saveFile(parent, `${exam.id}.exam`, exam).then(() => exam);
  }));
}

function publishAssessments(parent) {
  const options = { where: { type: 'ASSESSMENT' } };
  return parent.getTeachingElements(options).then(assessments => {
    return saveFile(parent, 'assessments', assessments).then(() => assessments);
  });
}

function fetchContainer(container) {
  return container.getTeachingElements().then(tes => ({
    ...pick(container, ['id', 'type', 'position', 'createdAt', 'updatedAt']),
    elements: tes
  }));
}

function fetchExams(parent) {
  return parent.getChildren({ where: { type: 'EXAM' } })
    .then(exams => Promise.map(exams, fetchQuestionGroups))
    .then(exams => map(exams, ({ exam, groups }) => {
      const attrs = ['id', 'parentId', 'createdAt', 'updatedAt'];
      return { ...pick(exam, attrs), groups };
    }));
}

function fetchQuestionGroups(exam) {
  return exam.getChildren().then(groups => {
    let attributes = ['id', 'type', 'position', 'data', 'createdAt', 'updatedAt'];
    return Promise.map(groups, group => {
      return group.getTeachingElements({ attributes }).then(elements => ({
        ...pick(group, ['id', 'position', 'data', 'createdAt']),
        elements
      }));
    });
  })
  .then(groups => ({ exam, groups }));
}

function saveFile(parent, key, data) {
  const { id, courseId } = parent;
  const buffer = Buffer.from(JSON.stringify(data), 'utf8');
  return storage.saveFile(`repository/${courseId}/${id}/${key}.json`, buffer);
}

function addToSpine(spine, activity) {
  let index = findIndex(spine.structure, { id: activity.id });
  if (index < 0) {
    spine.structure.push(activity);
  } else {
    spine.structure[index] = activity;
  }
}

module.exports = {
  publishActivity
};
