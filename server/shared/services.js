'use strict';

const config = require('../../config/server');
const storage = require('./storage');
const storageProxy = require('./storage/proxy');

module.exports = { config, storage, storageProxy };
