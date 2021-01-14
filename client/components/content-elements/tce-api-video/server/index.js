'use strict';

const { afterLoaded, afterSave, beforeSave } = require('tce-apivideo/dist/server/index.js');
const { options } = require('tce-apivideo/dist/tce-apivideo.umd');

module.exports = { type: options.type, beforeSave, afterSave, afterLoaded };
