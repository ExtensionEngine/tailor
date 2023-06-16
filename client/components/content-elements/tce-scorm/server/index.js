/**
 * For now `tce-scorm` build is broken, as it is using `require` on the `p-min-delay`
 * package that is the ES module. Once the build is fixed this comment can be removed
 * and commented stuff uncommented.
 */

// import scorm from '@extensionengine/tce-scorm/dist/tce-scorm.js';
import server from '@extensionengine/tce-scorm/dist/server/index.js';

// const { options } = scorm;
const { beforeSave } = server;

export default {
  /*type: options.type,*/
  type: 'SCORM', // Replace with the above version when build is fixed
  beforeSave
};
