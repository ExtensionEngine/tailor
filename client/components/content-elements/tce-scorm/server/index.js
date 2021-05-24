'use strict';

const { beforeSave } = require('@extensionengine/tce-scorm/dist/server');
const { options } = require('@extensionengine/tce-scorm/dist/tce-scorm');

module.exports = { type: options.type, beforeSave };
