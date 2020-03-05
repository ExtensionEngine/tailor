'use strict';

const {
  getRevisions
} = require('./helpers');
const { schedule } = require('../scheduler');

function initiateDigest() {
  getRevisions();
  // schedule(process.env.DIGEST_OPTIONS, getRevisions());
}

module.exports = {
  initiateDigest
};
