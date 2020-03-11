'use strict';

const processRepositoryRevisions = require('./lib');
const schedule = require('../scheduler');

function initiateDigest() {
  schedule(JSON.parse(process.env.DIGEST_OPTIONS), processRepositoryRevisions);
}

module.exports = initiateDigest;
