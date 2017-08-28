'use strict';

const cloneDeep = require('lodash/cloneDeep');
const cuid = require('cuid');
const Promise = require('bluebird');
const shuffle = require('lodash/shuffle');
const { TeachingElement } = require('../shared/database');

TeachingElement.findAll({ where: { type: 'ASSESSMENT', 'data.type': 'MQ' } })
  .then(processMatchingQuestions)
  .then(() => {
    console.log('Matching question data processed!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

function processMatchingQuestions(elements) {
  console.log(`Number of elements: ${elements.length}`);
  return Promise.each(elements, it => processMatchingQuestion(it));
}

function processMatchingQuestion(element) {
  const oldVal = element.data;
  if (oldVal.type !== 'MQ' || oldVal.premises) return element;

  let newVal = cloneDeep(oldVal);
  newVal.correct = {};
  newVal.premises = [];
  newVal.responses = [];
  oldVal.correct.forEach(it => {
    const premiseKey = cuid();
    const responseKey = cuid();
    newVal.correct[premiseKey] = responseKey;
    newVal.premises.push({ key: premiseKey, value: it.premise });
    newVal.responses.push({ key: responseKey, value: it.response });
  });
  newVal.premises = shuffle(newVal.premises);
  newVal.responses = shuffle(newVal.responses);
  console.log(`Processed: ${element.id} - ${element.type}, ${oldVal.type}`);
  console.log(`${JSON.stringify(oldVal, null, 2)}\n=>`);
  console.log(`${JSON.stringify(newVal, null, 2)}`);

  return element.update({ data: newVal });
}
