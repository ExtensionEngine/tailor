import '@extensionengine/tce-tiptap/dist/tce-tiptap.css';
import { Edit, options, Toolbar } from '@extensionengine/tce-tiptap/dist/tce-tiptap.umd';

export default {
  ...options,
  name: options.label,
  Edit,
  Toolbar
};
