const filter = require('lodash/filter');
const find = require('lodash/find');
const findIndex = require('lodash/findIndex');
const get = require('lodash/get');
const map = require('lodash/map');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const reduce = require('lodash/reduce');
const sortBy = require('lodash/sortBy');
const storage = require('../storage');

function publishActivity(activity) {
  return getStructureData(activity).then(data => {
    let { repository, predecessors, spine } = data;
    predecessors.forEach(it => {
      const exists = find(spine.structure, { id: it.id });
      if (!exists) addToSpine(spine, it);
    });
    activity.publishedAt = new Date();
    addToSpine(spine, activity);
    return publishContent(repository, activity).then(content => {
      attachContentSummary(find(spine.structure, { id: activity.id }), content);
      return saveSpine(spine).then(() => activity.save());
    });
  });
}

function publishRepositoryDetails(repository) {
  return repository.getPublishedStructure().then(spine => {
    Object.assign(spine, pick(repository, ['name', 'description', 'data']));
    renameKey(spine, 'data', 'meta');
    return saveSpine(spine);
  });
}

function unpublishActivity(repository, activity) {
  return repository.getPublishedStructure().then(spine => {
    const spineActivity = find(spine.structure, { id: activity.id });
    if (!spineActivity) return;
    const deleted = getSpineChildren(spine, activity).concat(spineActivity);
    return Promise.map(deleted, it => {
      const filenames = getActivityFilenames(it);
      return Promise.map(filenames, filename => {
        let key = `repository/${repository.id}/${it.id}/${filename}.json`;
        return storage.deleteFile(key);
      });
    }).then(() => {
      spine.structure = filter(spine.structure, ({ id }) => !find(deleted, { id }));
      return saveSpine(spine).then(() => activity.save());
    });
  });
}

function getStructureData(activity) {
  const repoData = activity.getCourse().then(repository => {
    return repository.getPublishedStructure()
      .then(spine => ({ repository, spine }));
  });
  return Promise.all([repoData, activity.predecessors()])
    .spread((repoData, predecessors) => Object.assign(repoData, { predecessors }));
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
    if (!assessments.length) return Promise.resolve([]);
    return saveFile(parent, 'assessments', assessments).then(() => assessments);
  });
}

function fetchContainer(container) {
  let attributes = ['id', 'type', 'position', 'data', 'createdAt', 'updatedAt'];
  return container.getTeachingElements({ attributes }).then(tes => ({
    ...pick(container, ['id', 'type', 'position', 'createdAt', 'updatedAt']),
    elements: sortBy(tes, 'position')
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

function saveSpine(spine) {
  const spineData = Buffer.from(JSON.stringify(spine), 'utf8');
  const key = `repository/${spine.id}/index.json`;
  return storage.saveFile(key, spineData);
}

function addToSpine(spine, activity) {
  const attributes = [
    'id', 'parentId', 'type', 'position', 'data',
    'publishedAt', 'updatedAt', 'createdAt'
  ];
  activity = pick(activity, attributes);
  renameKey(activity, 'data', 'meta');
  let index = findIndex(spine.structure, { id: activity.id });
  if (index < 0) {
    spine.structure.push(activity);
  } else {
    spine.structure[index] = activity;
  }
}

function getSpineChildren(spine, parent) {
  let children = filter(spine.structure, { parentId: parent.id });
  if (!children.length) return [];
  return children.concat(reduce(children, (acc, it) => {
    return acc.concat(getSpineChildren(spine, it));
  }, []));
}

function attachContentSummary(obj, { containers, exams, assessments }) {
  obj.contentContainers = map(containers, it => pick(it, ['id', 'type']));
  obj.exams = map(exams, it => pick(it, ['id']));
  obj.assessments = map(assessments, it => pick(it, ['id']));
}

function getActivityFilenames(spineActivity) {
  const { contentContainers = [], exams = [], assessments = [] } = spineActivity;
  let filenames = [];
  if (assessments.length) filenames.push('assessments');
  filenames.concat(map(exams, it => `${it.id}.exam`));
  filenames.concat(map(contentContainers, it => `${it.id}.container`));
  return filenames;
}

function renameKey(obj, key, newKey) {
  obj[newKey] = obj[key];
  delete obj[key];
}

module.exports = {
  publishActivity,
  unpublishActivity,
  publishRepositoryDetails
};
