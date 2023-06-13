import Edit from './edit/index.vue';

const initState = () => {
  return {
    embeds: {},
    items: {}
  };
};

export default {
  name: 'Accordion',
  type: 'ACCORDION',
  version: '1.0',
  initState,
  Edit,
  ui: {
    icon: 'mdi-view-sequential',
    forceFullWidth: true
  }
};
