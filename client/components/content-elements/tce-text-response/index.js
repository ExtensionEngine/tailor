import Edit from './edit';
import yup from 'yup';

const schema = {
  correct: yup.string().trim().min(1).max(7000).required()
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
