import * as yup from 'yup';
import cuid from 'cuid';
import Edit from './edit';
import map from 'lodash/map';
import times from 'lodash/times';
import toPairs from 'lodash/toPairs';

yup.addMethod(yup.array, 'castMap', function () {
  return this.transform(function (value, originalValue) {
    if (this.isType(value)) return value;
    return map(toPairs(originalValue), it => ({ key: it[0], value: it[1] }));
  });
});

const createValidator = label => yup.object().test({
  test: function ({ key, value }) {
    return yup.string().required().label(label).validate(value)
      .catch(err => this.createError({ ...err, path: key }));
  }
});

const schema = {
  groups: yup.array().castMap().of(createValidator('Group name')).min(2),
  answers: yup.array().castMap().of(createValidator('Answer')),
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
