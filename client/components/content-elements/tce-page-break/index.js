import Edit from './edit/index.vue';

const initState = () => ({});

export default {
  name: 'Section Break',
  type: 'BREAK',
  version: '1.0',
  initState,
  Edit,
  ui: {
    icon: 'mdi-format-page-break',
    forceFullWidth: true
  }
};
