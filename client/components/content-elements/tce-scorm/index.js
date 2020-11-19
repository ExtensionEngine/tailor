import Edit from './edit';
import Toolbar from './edit/Toolbar';

const initState = () => ({ launchUrl: null });

export default {
  name: 'Scorm',
  type: 'SCORM',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-package-up',
    forceFullWidth: true
  }
};
