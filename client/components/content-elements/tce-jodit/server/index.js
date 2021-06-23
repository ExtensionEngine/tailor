'use strict';

const { afterLoaded, beforeSave } = require('@extensionengine/tce-jodit/dist/server');
const { tailor: options } = require('@extensionengine/tce-jodit/package.json');

module.exports = {
  type: options.type,
  beforeSave,
  afterLoaded
};
