'use strict';

const Promise = require('bluebird');
const { Activity, sequelize, TeachingElement } = require('../shared/database');

TeachingElement.findAll({
  include: [{ model: Activity, where: { type: 'ASSESSMENT_GROUP' } }]
})
  .then(fixExamReferences)
  .then(() => {
    console.log('Topics linked to exam questions');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

function fixExamReferences(elements) {
  return sequelize.transaction(transaction => {
    return Promise.each(elements, element => {
      if (!element.data._refs) return Promise.resolve();
      element.refs = element.data._refs;
      element.changed('refs', true);
      return element.save({ transaction });
    });
  });
}
