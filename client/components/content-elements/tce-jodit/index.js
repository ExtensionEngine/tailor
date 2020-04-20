import '@extensionengine/tce-jodit/dist/tce-jodit.css';
import { Edit, options, Toolbar } from '@extensionengine/tce-jodit/dist/tce-jodit.umd';

export default {
  ...options,
  name: options.label,
  Edit,
  Toolbar
};
