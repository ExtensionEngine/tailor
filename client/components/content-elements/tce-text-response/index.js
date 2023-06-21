import * as yup from 'yup';
import Edit from './edit/index.vue';

const schema = {
  correct: yup.string().trim().max(7000).required().label('Answer')
};

const initState = () => ({
  correct: ''
});

export default {
  name: 'Text Response',
  type: 'QUESTION',
  subtype: 'TR',
  version: '1.0',
  schema,
  initState,
  Edit,
  ui: {
    forceFullWidth: true
  }
};
