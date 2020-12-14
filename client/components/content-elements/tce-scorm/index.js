import '@extensionengine/tce-scorm/dist/tce-scorm.css';
import { Edit, options, Toolbar } from '@extensionengine/tce-scorm/dist/tce-scorm.umd';

export default {
  ...options,
  name: options.label,
  Edit,
  Toolbar
};
