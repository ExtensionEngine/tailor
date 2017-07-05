'use strict';

const cloneDeep = require('lodash/cloneDeep');
const cuid = require('cuid');
const Promise = require('bluebird');
const { TeachingElement } = require('../shared/database');

TeachingElement.findAll({ where: { type: 'ASSESSMENT' } })
  .then(processComposites)
  .then(() => {
    console.log('Matching question data processed!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

function processComposites(elements) {
  console.log(`Number of components: ${elements.length}`);
  return Promise.each(elements, it => processMQData(it));
}

function processMQData(element) {
  if (element.data.type !== 'MQ' || element.data.premises) return element;
  let parsed = cloneDeep(element.data);
  parsed.correct = {};
  parsed.premises = [];
  parsed.responses = [];

  element.data.correct.forEach(it => {
    const premiseKey = cuid();
    const responseKey = cuid();
    parsed.correct[premiseKey] = responseKey;
    parsed.premises.push({ key: premiseKey, value: it.premise });
    parsed.responses.push({ key: responseKey, value: it.response });
  });

  return element.update({ data: parsed });
}
