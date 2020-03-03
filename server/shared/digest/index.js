'use strict';
const CronTask = require('cron').CronJob;
const {
  ContentElement,
  Activity,
  Repository,
  RepositoryUser,
  Revision,
  User
} = require('../database');
const { Op } = require('sequelize');
const { processDigest } = require('./helpers');
const util = require('util');

async function initiateDigest() {
  const elementActivity = await ContentElement.findAll({
    attributes: [
      ['id', 'content_id'],
      'repository_id',
      'activity_id',
      ['type', 'content_type'],
      ['created_at', 'content_element_created_at'],
      ['data', 'content_data']
    ],
    include: [
      {
        model: Activity,
        attributes: [
          'data',
          'parent_id',
          'type'
        ]
      },
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
                [Op.gte]: new Date().setDate(new Date().getDate() - 7)
              }
            }
          },
          {
            model: User,
            attributes: [
              'email'
            ]
          }
        ]
      }
    ],
    raw: true
  });

  // Vamo provjeravan kako izgleda query i pocetna obrada
  console.log(util.inspect(processDigest(elementActivity), false, null, true));
}

module.exports = {
  initiateDigest
};
