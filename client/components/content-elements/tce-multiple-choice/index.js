import Edit from './edit';
import yup from 'yup';

const schema = {
  answers: yup.array().min(2).of(yup.string().trim().min(1).max(500)).required(),
  correct: yup.array().min(1).of(yup.number()).required()
};

const initState = () => ({
  answers: ['', '', ''],
  correct: []
});

export default {
  name: 'Multiple Choice',
  type: 'QUESTION',
  subtype: 'MC',
  version: '1.0',
  schema,
  initState,
  Edit,
  ui: {
    forceFullWidth: true
  }
};
