import Edit from './edit';

const initState = () => ({});

export default {
  name: 'Page Break',
  type: 'BREAK',
  version: '1.0',
  initState,
  Edit,
  ui: {
    icon: 'mdi-format-page-break',
    forceFullWidth: true
  }
};
