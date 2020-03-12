'use strict';

const { getSchema } = require('../../../config/shared/activities');
const { Op } = require('sequelize');
const { User, Repository, Revision } = require('../database');
const { Sequelize } = require('../database');
const { subDays, format } = require('date-fns');
const cloneDeep = require('lodash/cloneDeep');
const mapValues = require('lodash/mapValues');

async function processRepositoryRevisions() {
  const groupedData = groupByUsersAndRepositories(
    await getUsersWithRepositoriesAndRevisions()
  );
  const filteredRepos = filterRevisions(filterNewRepos(groupedData));
  const templateData = mapValues(filteredRepos, (repositories, email) => (
    repositories.map(repository => (
      {
        name: repository.name,
        createdAt: format(repository.createdAt, 'MM-dd-yyyy'),
        color: repository.color,
        revisions: groupByEntity(repository.revisions)
      }
    )))
  );
  return templateData;
}

module.exports = processRepositoryRevisions;

function getUsersWithRepositoriesAndRevisions() {
  return User.findAll({
    attributes: ['email'],
    where: { created_at: { [Op.ne]: Sequelize.col('user.updated_at') } },
    include: [
      {
        model: Repository,
        attributes: ['name', 'data', 'created_at', 'schema'],
        include: [
          {
            model: Revision,
            attributes: ['entity', 'operation', 'created_at', 'state', 'id'],
            where: {
              createdAt: { [Op.gte]: subDays(new Date(), 10) }
            }
          }
        ]
      }
    ]
  });
}
function groupByUsersAndRepositories(users) {
  return users.reduce((result, user) => {
    const { email } = user;
    result[email] = user.repositories.map(repo => formatRepository(repo));
    return result;
  }, {});
}
function formatRepository(repo) {
  const { name, revisions, repositoryUser, data, schema } = repo;
  return {
    revisions: revisions.map(revision => formatRevision(revision, schema)),
    color: data.color,
    name,
    schema,
    userAddedToRepository: repositoryUser.createdAt,
    createdAt: repo.get({ plain: true }).created_at
  };
}
function formatRevision(revision, schema) {
  const { entity, operation, state, id } = revision;
  return {
    id,
    entity,
    operation,
    createdAt: revision.get({ plain: true }).created_at,
    type: state.type ? state.type.split('/').pop() : null,
    color: getActivityColor(schema, state.type)
  };
}
function filterNewRepos(groupedUsers) {
  return mapValues(groupedUsers,
    userRepositories => userRepositories
      .filter(repo => (repo.userAddedToRepository > subDays(new Date(), 3))));
}
function filterRevisions(repos) {
  const clonedRepos = cloneDeep(repos);
  mapValues(repos, (repositories, userEmail) => {
    repositories.forEach((repo, i) => {
      clonedRepos[userEmail][i].revisions = filterRevisionsSinceDate(
        repo.revisions, repo.userAddedToRepository < subDays(new Date(), 10)
          ? subDays(new Date(), 7)
          : repo.userAddedToRepository
      );
    });
  });
  return clonedRepos;
}
function filterRevisionsSinceDate(revisions, date) {
  return revisions.filter(revision => revision.createdAt > date);
}
function groupByEntity(revisions) {
  const groupModel = revisions.reduce((acc, revision) => {
    if (revision.entity === 'ACTIVITY') {
      acc.activity.push(revision);
    } else if (revision.entity === 'CONTENT_ELEMENT') {
      acc.contentElement.push(revision);
    }
    return acc;
  }, {
    activity: [],
    contentElement: []
  });
  groupModel.activity = groupByOperation(groupModel.activity);
  groupModel.contentElement = groupByOperation(groupModel.contentElement);

  return groupModel;
}
function groupByOperation(operation) {
  return reduceEntity(operation).map(type => ({
    color: type.color,
    type: type.type,
    iconUrl: getIcon(type.type),
    operations: reduceEntityOperation(type.operations)
  }));
}
function reduceEntity(entity) {
  return entity.reduce((acc, next) => {
    const found = acc.find(current => (
      current.type.toLowerCase() === next.type.toLowerCase()
    ));
    const value = { id: next.id, operation: next.operation };
    if (!found) {
      acc.push({
        type: next.type.toLowerCase(),
        color: next.color,
        operations: [value]
      });
    } else found.operations.push(value);
    return acc;
  }, []);
}
function reduceEntityOperation(entity) {
  return entity.reduce((acc, next) => {
    const found = acc.find(current => (
      current.operation.toLowerCase() === next.operation.toLowerCase()
    ));
    if (!found) {
      acc.push({
        operation: next.operation.toLowerCase(),
        count: 1
      });
    } else found.count += 1;
    return acc;
  }, []);
}
function getActivityColor(schema, type) {
  const element = getSchema(schema).structure
    .find(element => element.type === type);
  return element ? element.color : '#fefefe';
}
function getIcon(iconName) {
  const baseUrlIconify = 'https://api.iconify.design/mdi:';
  const iconMap = {
    image: 'image.svg',
    video: 'video.svg',
    'brightcove-video': 'video.svg',
    embed: 'arrange-bring-forward.svg',
    audio: 'volume-high.svg',
    break: 'format-page-break.svg',
    carousel: 'view-carousel.svg',
    html: 'format-text.svg',
    table: 'table.svg',
    assessment: 'help.svg',
    accordion: 'menu.svg',
    modal: 'window-maximize.svg',
    pdf: 'file-pdf-box.svg',
    default: 'content-paste.svg'
  };

  return baseUrlIconify +
    (iconMap[iconName]
      ? iconMap[iconName]
      : iconMap.default);
}
