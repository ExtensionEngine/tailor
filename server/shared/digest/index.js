'use strict';

const processRepositoryRevisions = require('./lib');
const schedule = require('../scheduler');

function initiateDigest() {
  processRepositoryRevisions();
  // schedule(process.env.DIGEST_OPTIONS, processRepositoryRevisions);
}

module.exports = initiateDigest;
