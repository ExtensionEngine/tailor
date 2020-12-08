// Copyright 2016-2020, Pulumi Corporation.  All rights reserved.
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// getFileHash calculates a hash for all of the files under the scripts directory.
function getFileHash(filename) {
  const data = fs.readFileSync(path.join(__dirname, filename), { encoding: 'utf8' });
  const hash = crypto.createHash('md5').update(data, 'utf8');
  return hash.digest('hex');
}

module.exports = { getFileHash };
