import * as yup from 'yup';
import Edit from './edit/index.vue';

const MESSAGE = 'Please choose the correct answer';

const answer = () => yup.string().trim().max(500).required().label('Answer');

const schema = {
  answers: yup.array().min(2).of(answer()).required(),
  correct: yup.number().required(MESSAGE).typeError(MESSAGE)
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
