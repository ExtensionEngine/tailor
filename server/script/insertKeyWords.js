'use strict';

const { Activity } = require('../shared/database');
const Promise = require('bluebird');
const { mappedTopics: topics } = require('../../key_word_mappings.json');

insertKeyWords()
  .then(() => {
    console.info('Inserted keywords.');
    process.exit(0);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });

function insertKeyWords() {
  return Promise.each(topics, ({ id, words }) => {
    return Activity
      .findOne({ where: { id } })
      .then(topic => {
        if (!topic) return console.info(id);
        const data = { ...topic.data, keywords: words };
        return topic.update({ data });
      });
  });
}
