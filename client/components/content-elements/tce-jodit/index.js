import '@extensionengine/tce-jodit/tce-jodit.css';
import { Edit, options, Toolbar } from '@extensionengine/tce-jodit';

export default {
  ...options,
  name: options.label,
  Edit,
  Toolbar
};
