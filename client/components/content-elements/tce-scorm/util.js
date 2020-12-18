const { beforeSave } = require('@extensionengine/tce-scorm/dist/util');
const { options } = require('@extensionengine/tce-scorm/dist/tce-scorm');

module.exports = { type: options.type, beforeSave };
