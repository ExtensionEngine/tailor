'use strict';

const groupArray = require('group-array');
const cronParser = require('cron-parser');
const mapKeys = require('lodash/mapKeys');
const logger = require('../../shared/logger');
const mail = require('../mail');
const pick = require('lodash/pick');
const {
  ContentElement,
  Activity,
  Repository,
  RepositoryUser,
  Revision,
  User
} = require('../database');
const { Op } = require('sequelize');

const getRevisionsSinceDate = async lastDigestDate => {
  const elementActivity = await User.findAll({
    attributes: [
      'email',
      'updated_at',
      'created_at'
    ],
    include: [
      {
        model: Repository,
        attributes: [
          'id',
          'name',
          'created_at',
          'data'
        ],
        include: [
          {
            model: RepositoryUser,
            attributes: ['user_id', ['created_at', 'repository_user_added']]
          },
          {
            model: Revision,
            attributes: [
              'operation'
            ],
            where: {
              created_at: {
                [Op.gte]: lastDigestDate
              }
            }
          },
          {
            model: Activity,
            attributes: [
              'data',
              'parent_id',
              'type'
            ]
          },
          {
            model: ContentElement,
            attributes: [
              ['id', 'content_id'],
              'repository_id',
              'activity_id',
              ['type', 'content_type'],
              ['created_at', 'content_element_created_at'],
              ['data', 'content_data']
            ]
          }
        ]
      }
    ],
    raw: true
  });
  return elementActivity;
};

// Nova funkcija
const processDigest = revisions => {
  const processedRevisions = revisions.map(revision => {
    // Pick stvara novi objekt od staroga sa tin keyevima sta pickas tu
    return pick(revision,
      [
        'email',
        'updated_at',
        'created_at',
        'repositories.name',
        'repositories.data',
        'repositories.created_at',
        'repositories.repositoryUsers.repository_user_added',
        'repositories.activities.parent_id',
        'repositories.activity_id',
        'repositories.activity_type',
        'repositories.activity_data',
        'repositories.ContentElements.id',
        'repositories.ContentElements.content_type',
        'repositories.ContentElements.content_data',
        'repositories.revisions.operation'
      ]);
  });

  // grupira redom po tin keyevima znaci otpr ovako
  // { 'admin@extensionengine.com':
  //  { 'Reponame':
  //     { '3':
  //        { '4':
  //           { '3':   ...
  return groupArray(
    processedRevisions,
    'email',
    'repositories.name'
  );
};

module.exports = {
  processDigest,
  getRevisionsSinceDate
};
