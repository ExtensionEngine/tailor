'use strict';

const filter = require('lodash/filter');
const find = require('lodash/find');
const findIndex = require('lodash/findIndex');
const get = require('lodash/get');
const { getLevelRelationships } = require('../../../config/shared/activities');
const hash = require('hash-obj');
const keys = require('lodash/keys');
const map = require('lodash/map');
const omit = require('lodash/omit');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const reduce = require('lodash/reduce');
const { resolveStatics } = require('../storage/helpers');
const storage = require('../storage');
const { TeachingElement } = require('../database');
const without = require('lodash/without');

const { FLAT_REPO_STRUCTURE } = process.env;

const TES_ATTRS = [
  'id', 'uid', 'type', 'contentId', 'contentSignature',
  'position', 'data', 'meta', 'refs', 'createdAt', 'updatedAt'
];

function publishActivity(activity) {
  return getStructureData(activity).then(data => {
    const { repository, predecessors, spine } = data;
    predecessors.forEach(it => {
      const exists = find(spine.structure, { id: it.id });
      if (!exists) addToSpine(spine, it);
    });
    activity.publishedAt = new Date();
    addToSpine(spine, activity);
    return publishContent(repository, activity).then(content => {
      attachContentSummary(find(spine.structure, { id: activity.id }), content);
      return saveSpine(spine)
        .then(savedSpine => updateRepositoryCatalog(repository, savedSpine.publishedAt))
        .then(() => activity.save());
    });
  });
}

function updateRepositoryCatalog(repository, publishedAt) {
  return storage.getFile('repository/index.json').then(buffer => {
    const catalog = (buffer && JSON.parse(buffer.toString('utf8'))) || [];
    const existing = find(catalog, { id: repository.id });
    const repositoryData = { ...getRepositoryAttrs(repository), publishedAt };
    if (existing) {
      Object.assign(existing, omit(repositoryData, ['id']));
    } else {
      catalog.push(repositoryData);
    }
    const data = Buffer.from(JSON.stringify(catalog), 'utf8');
    return storage.saveFile('repository/index.json', data);
  });
}

function publishRepositoryDetails(repository) {
  return getPublishedStructure(repository).then(spine => {
    Object.assign(spine, getRepositoryAttrs(repository));
    return saveSpine(spine)
      .then(savedSpine => updateRepositoryCatalog(repository, savedSpine.publishedAt));
  });
}

function unpublishActivity(repository, activity) {
  return getPublishedStructure(repository).then(spine => {
    const spineActivity = find(spine.structure, { id: activity.id });
    if (!spineActivity) return;
    const deleted = getSpineChildren(spine, activity).concat(spineActivity);
    return Promise.map(deleted, it => {
      const filenames = getActivityFilenames(it);
      return Promise.map(filenames, filename => {
        const key = `${getBaseUrl(repository.id, it.id)}/${filename}.json`;
        return storage.deleteFile(key);
      });
    }).then(() => {
      spine.structure = filter(spine.structure, ({ id }) => !find(deleted, { id }));
      return saveSpine(spine)
        .then(savedSpine => updateRepositoryCatalog(repository, savedSpine.publishedAt))
        .then(() => activity.save());
    });
  });
}

function getStructureData(activity) {
  const repoData = activity.getCourse().then(repository => {
    return getPublishedStructure(repository).then(spine => ({ repository, spine }));
  });
  return Promise.all([repoData, activity.predecessors()])
    .spread((repoData, predecessors) => Object.assign(repoData, { predecessors }));
}

function getPublishedStructure(repository) {
  const storageKey = `repository/${repository.id}/index.json`;
  return storage.getFile(storageKey).then(buffer => {
    const data = buffer && JSON.parse(buffer.toString('utf8'));
    return data || { ...getRepositoryAttrs(repository), structure: [] };
  });
}

async function fetchActivityContent(repository, activity, signed = false) {
  const res = await Promise.all([
    fetchContainers(repository, activity),
    fetchAssessments(activity),
    fetchExams(activity)
  ]).spread((containers, assessments, exams) => ({ containers, assessments, exams }));
  if (!signed) return res;
  res.containers = await Promise.map(res.containers, resolveContainer);
  res.assessments = await resolveAssessments(res.assessments);
  res.exams = await Promise.map(res.exams, resolveExam);
  return res;
}

function publishContent(repository, activity) {
  return Promise.all([
    publishContainers(repository, activity),
    publishExams(activity),
    publishAssessments(activity)
  ]).spread((containers, exams, assessments) => ({ containers, exams, assessments }));
}

function publishContainers(repository, parent) {
  return fetchContainers(repository, parent)
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
  return fetchAssessments(parent).then(assessments => {
    const key = getAssessmentsKey(parent);
    return saveFile(parent, key, assessments).then(() => assessments);
  });
}

function fetchContainers(repository, parent) {
  const config = find(repository.getSchemaConfig().structure, pick(parent, 'type'));
  const containerTypes = get(config, 'contentContainers', []);
  return parent.getChildren({ where: { type: containerTypes } })
    .then(containers => Promise.map(containers, fetchContainer));
}

function fetchContainer(container) {
  const order = [['position', 'ASC']];
  return container.getTeachingElements({ attributes: TES_ATTRS, order }).then(tes => ({
    ...pick(container, ['id', 'uid', 'type', 'position', 'createdAt', 'updatedAt']),
    elements: map(tes, (it, index) => {
      it.position = index + 1;
      return it;
    })
  }));
}

function fetchAssessments(parent) {
  const options = { where: { type: 'ASSESSMENT' }, attributes: TES_ATTRS };
  return parent.getTeachingElements(options);
}

function fetchExams(parent) {
  return parent.getChildren({ where: { type: 'EXAM' } })
    .then(exams => Promise.map(exams, fetchQuestionGroups))
    .then(exams => map(exams, ({ exam, groups }) => {
      const attrs = [
        'id', 'uid', 'type', 'position', 'parentId', 'createdAt', 'updatedAt'
      ];
      return { ...pick(exam, attrs), groups };
    }));
}

async function fetchQuestionGroups(exam) {
  const groups = await exam.getChildren({
    include: [{ model: TeachingElement, attributes: TES_ATTRS }]
  });
  // TODO: Name relationship in order to avoid PascalCase
  return {
    exam,
    groups: map(groups, group => ({
      ...pick(group, ['id', 'uid', 'type', 'position', 'data', 'createdAt']),
      intro: filter(group.TeachingElements, it => it.type !== 'ASSESSMENT'),
      assessments: filter(group.TeachingElements, { type: 'ASSESSMENT' })
    }))
  };
}

async function resolveContainer(container) {
  container.elements = await Promise.map(container.elements, resolveStatics);
  return container;
}

function resolveAssessments(assessments) {
  return Promise.map(assessments, resolveStatics);
}

async function resolveExam(exam) {
  exam.groups = await Promise.map(exam.groups, async group => {
    group.intro = await Promise.map(group.intro, resolveStatics);
    group.assessments = await Promise.map(group.assessments, resolveStatics);
    return group;
  });
  return exam;
}

function saveFile(parent, key, data) {
  const buffer = Buffer.from(JSON.stringify(data), 'utf8');
  const baseUrl = getBaseUrl(parent.courseId, parent.id);
  return storage.saveFile(`${baseUrl}/${key}.json`, buffer);
}

function saveSpine(spine) {
  const hashProperties = pick(spine, without(keys(spine), ['version', 'publishedAt']));
  const version = hash(hashProperties, { algorithm: 'sha1' });
  const updatedSpine = { ...spine, version, publishedAt: new Date() };
  const spineData = Buffer.from(JSON.stringify(updatedSpine), 'utf8');
  const key = `repository/${spine.id}/index.json`;
  return storage.saveFile(key, spineData).then(() => updatedSpine);
}

function addToSpine(spine, activity) {
  const relationships = getLevelRelationships(activity.type);
  activity = Object.assign(
    pick(activity, [
      'id', 'uid', 'parentId', 'type', 'position', 'data',
      'publishedAt', 'updatedAt', 'createdAt'
    ]), {
      relationships: mapRelationships(relationships, activity)
    }
  );
  renameKey(activity, 'data', 'meta');
  const index = findIndex(spine.structure, { id: activity.id });
  if (index < 0) {
    spine.structure.push(activity);
  } else {
    spine.structure[index] = activity;
  }
}

function getSpineChildren(spine, parent) {
  const children = filter(spine.structure, { parentId: parent.id });
  if (!children.length) return [];
  return children.concat(reduce(children, (acc, it) => {
    return acc.concat(getSpineChildren(spine, it));
  }, []));
}

function getRepositoryAttrs(repository) {
  const attrs = ['id', 'uid', 'schema', 'name', 'description', 'data'];
  const temp = pick(repository, attrs);
  renameKey(temp, 'data', 'meta');
  return temp;
}

function attachContentSummary(obj, { containers, exams, assessments }) {
  obj.contentContainers = map(containers, it => ({
    ...pick(it, ['id', 'uid', 'type']),
    elementCount: it.elements.length
  }));
  obj.exams = map(exams, it => pick(it, ['id', 'uid']));
  obj.assessments = map(assessments, it => pick(it, ['id', 'uid']));
}

function getActivityFilenames(spineActivity) {
  const { contentContainers = [], exams = [], assessments = [] } = spineActivity;
  const filenames = [];
  if (assessments.length) filenames.push(getAssessmentsKey(spineActivity));
  filenames.push(...map(exams, it => `${it.id}.exam`));
  filenames.push(...map(contentContainers, it => `${it.id}.container`));
  return filenames;
}

function renameKey(obj, key, newKey) {
  obj[newKey] = obj[key];
  delete obj[key];
}

function getAssessmentsKey(parent) {
  return FLAT_REPO_STRUCTURE ? `${parent.id}.assessments` : 'assessments';
}

function getBaseUrl(repoId, parentId) {
  return FLAT_REPO_STRUCTURE
    ? `repository/${repoId}`
    : `repository/${repoId}/${parentId}`;
}

function mapRelationships(relationships, activity) {
  return relationships.reduce((acc, { type }) => {
    return Object.assign(acc, { [type]: get(activity, `refs.${type}`, []) });
  }, {});
}

module.exports = {
  publishActivity,
  unpublishActivity,
  publishRepositoryDetails,
  fetchActivityContent
};
