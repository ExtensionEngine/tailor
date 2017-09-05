const Promise = require('bluebird');
const { TeachingElement } = require('../shared/database');

TeachingElement.findAll({ where: { type: 'EMBED' } })
  .then(processEmbeds)
  .then(() => {
    console.log('Embeds processed!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

function processEmbeds(elements) {
  console.log(`Number of components: ${elements.length}`);
  return Promise.each(elements, it => processEmbed(it));
}

function processEmbed(element) {
  if (!element.data.height) element.data.height = 300;
  return element.update({ data: element.data });
}
