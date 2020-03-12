'use strict';

const { sendActivityDigest } = require('../mail');
const mapValues = require('lodash/mapValues');
const processRepositoryRevisions = require('./lib');
const schedule = require('../scheduler');

function initiateDigest() {
  schedule(JSON.parse(process.env.DIGEST_OPTIONS), async () => {
    mapValues(await processRepositoryRevisions(), (repositories, email) => {
      sendActivityDigest(email, repositories);
    });
  });
}

module.exports = initiateDigest;
