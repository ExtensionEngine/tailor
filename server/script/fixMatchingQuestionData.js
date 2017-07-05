'use strict';

const forEach = require('lodash/forEach');
const Promise = require('bluebird');
const { TeachingElement } = require('../shared/database');

const tesType = 'ASSESSMENT';

TeachingElement.findAll({ where: { type: tesType } })
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
  console.log(element.dataValues);
  let embeds = element.data.embeds || element.data.question;
  if (!embeds) return element;

  // let hasChanges = false;

  forEach(embeds, it => {
    console.log(it);
  });

  // forEach(embeds, it => {
  //   if (it.type === 'IMAGE' && isUrl(it.data.url)) {
  //     const original = it.data.url;
  //     const parsed = url.parse(original);
  //     it.data.url = parsed.pathname.substr(1, parsed.pathname.length);
  //     console.log(`Processed: ${element.id} - ${element.type}`);
  //     console.log(`${original} => ${it.data.url}`);
  //     hasChanges = true;
  //   }
  // });
  //
  // return hasChanges ? element.update({ data: element.data }) : element;

  return element;
}
