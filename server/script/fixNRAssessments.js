const Promise = require('bluebird');
const { TeachingElement } = require('../shared/database');
const toNumber = require('lodash/toNumber');

TeachingElement.findAll({ where: { type: 'ASSESSMENT', 'data.type': 'NR' } })
  .then(processNRQuestions)
  .then(() => {
    console.log('Numeric Response data processed!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

function processNRQuestions(elements) {
  console.log(`Number of elements: ${elements.length}`);
  return Promise.each(elements, it => processNRQuestion(it));
}

function processNRQuestion(element) {
  const oldVal = element.data;
  if (oldVal.type !== 'NR' || oldVal.prefixes) return element;

  let newVal = {
    correct: [toNumber(oldVal.correct)],
    prefixes: [''],
    suffixes: ['']
  };

  console.log(`Processed: ${element.id} - ${element.type}, ${oldVal.type}`);
  console.log(`${JSON.stringify(oldVal, null, 2)}\n=>`);
  console.log(`${JSON.stringify(newVal, null, 2)}`);
  return element.update({ data: newVal });
}
