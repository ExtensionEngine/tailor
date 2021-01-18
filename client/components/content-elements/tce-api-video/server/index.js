'use strict';

const { options } = require('tce-apivideo/dist/tce-apivideo.umd');
const server = require('tce-apivideo/dist/server/index.js');

module.exports = { ...server, type: options.type };
