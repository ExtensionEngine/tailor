import cuid from 'cuid';
import Edit from './edit';
import times from 'lodash/times';
import yup from 'yup';

const objectMap = yup.object().shape({
  key: yup.string().required(),
  value: yup.string().required()
});

const schema = {
  groups: yup.array().castMap().of(objectMap).min(2),
  answers: yup.array().castMap().of(objectMap),
  correct: yup.array().castMap().of(yup.object().shape({
    key: yup.string().required(),
    value: yup.array().of(yup.string().required()).min(1)
  })).min(1)
};

const initState = () => {
  const element = {
    groups: {},
    answers: {},
    correct: {}
  };
  times(2, () => {
    const groupKey = cuid();
    const answerKey = cuid();
    element.groups[groupKey] = '';
    element.answers[answerKey] = '';
    element.correct[groupKey] = [answerKey];
  });
  return element;
};

export default {
  name: 'Drag & Drop',
  type: 'ASSESSMENT',
  subtype: 'DD',
  version: '1.0',
  schema,
  initState,
  Edit,
  ui: {
    forceFullWidth: true
  }
};
