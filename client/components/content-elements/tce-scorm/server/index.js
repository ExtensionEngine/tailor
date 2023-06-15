import server from '@extensionengine/tce-scorm/dist/server/index.js';
import { options } from '@extensionengine/tce-scorm/dist/tce-scorm.js';

const { beforeSave } = server;

module.exports = { type: options.type, beforeSave };
