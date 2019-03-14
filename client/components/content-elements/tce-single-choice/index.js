import Edit from './edit';
import yup from 'yup';

const schema = {
  answers: yup.array().min(2).of(yup.string().trim().min(1).max(500).required()).required(),
  correct: yup.number().required()
};

const initState = () => ({
  answers: ['', ''],
  correct: ''
});

export default {
  name: 'Single Choice',
  type: 'QUESTION',
  subtype: 'SC',
  version: '1.0',
  schema,
  initState,
  Edit,
  ui: {
    forceFullWidth: true
  }
};
