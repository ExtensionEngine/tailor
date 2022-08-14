import * as yup from 'yup';
import Edit from './edit/index.vue';

const MESSAGE = 'Please choose at least one correct answer';

const answer = () => yup.string().trim().max(500).required().label('Answer');

const schema = {
  answers: yup.array().min(2).of(answer()).required(),
  correct: yup.array().min(1, MESSAGE).of(yup.number()).required()
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
