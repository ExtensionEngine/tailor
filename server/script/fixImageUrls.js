'use strict';

const forEach = require('lodash/forEach');
const isUrl = require('is-url');
const map = require('lodash/map');
const Promise = require('bluebird');
const { TeachingElement } = require('../shared/database');
const url = require('url');

const tesTypes = ['CAROUSEL', 'ACCORDION', 'ASSESSMENT', 'MODAL'];

TeachingElement.findAll({ where: { $or: map(tesTypes, it => ({ type: it })) } })
  .then(processComposites)
  .then(() => {
    console.log('Images processed!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

function processComposites(elements) {
  console.log(`Number of components: ${elements.length}`);
  return Promise.each(elements, it => processImages(it));
}

function processImages(element) {
  let embeds = element.data.embeds || element.data.question;
  if (!embeds) return element;

  let hasChanges = false;
  forEach(embeds, it => {
    if (it.type === 'IMAGE' && isUrl(it.data.url)) {
      const original = it.data.url;
      const parsed = url.parse(original);
      it.data.url = parsed.pathname.substr(1, parsed.pathname.length);
      console.log(`Processed: ${element.id} - ${element.type}`);
      console.log(`${original} => ${it.data.url}`);
      hasChanges = true;
    }
  });

  return hasChanges ? element.update({ data: element.data }) : element;
}
