import cuid from 'cuid';
import dropRight from 'lodash/dropRight';
import find from 'lodash/find';
import get from 'lodash/get';
import last from 'lodash/last';
import map from 'lodash/map';
import times from 'lodash/times';
import toPairs from 'lodash/toPairs';
import toPath from 'lodash/toPath';
import yup from 'yup';

const TEXT_CONTAINERS = ['HTML', 'JODIT_HTML'];

export const typeInfo = {
  MC: { type: 'MC', title: 'Multiple choice', class: 'multiple-choice' },
  SC: { type: 'SC', title: 'Single choice', class: 'single-choice' },
  TR: { type: 'TR', title: 'Text response', class: 'text-response' },
  NR: { type: 'NR', title: 'Numerical response', class: 'numerical-response' },
  TF: { type: 'TF', title: 'True - false', class: 'true-false' },
  FB: { type: 'FB', title: 'Fill in the blank', class: 'fill-blank' },
  MQ: { type: 'MQ', title: 'Matching question', class: 'matching-question' },
  DD: { type: 'DD', title: 'Drag & Drop', class: 'drag-drop' }
};

export const helperText = {
  FB: { question: 'Type "@blank" when new blank is needed.' }
};

const BLANK_PLACEHOLDER = /(@blank)/g;

function containsText(asset) {
  return TEXT_CONTAINERS.includes(asset.type) &&
    asset.data.content &&
    asset.data.content.trim().length > 0;
}

function containsBlanks(asset) {
  return asset.data.content.match(BLANK_PLACEHOLDER);
}

const question = yup.array().test(
  'has-text', 'Please define question', question => !!find(question, containsText)
);

const fbQuestion = yup.array().test(
  'has-blanks', 'At least one @blank required', question => {
    return !!find(question, it => containsText(it) && containsBlanks(it));
  }
);

const hint = yup.string().trim().max(500);

const _refs = yup.object().shape({
  objectiveId: yup.number().integer().positive()
});

const objectMap = yup.object().shape({
  key: yup.string().required(),
  value: yup.string().required()
});

yup.addMethod(yup.array, 'castMap', function () {
  return this.transform(function (value, originalValue) {
    if (this.isType(value)) return value;
    return map(toPairs(originalValue), it => ({ key: it[0], value: it[1] }));
  });
});

const baseSchema = {
  question,
  hint,
  _refs
};

export const schemas = {
  MC: yup.object().shape({
    ...baseSchema,
    answers: yup.array().min(2).of(yup.string().trim().min(1).max(500)).required(),
    correct: yup.array().min(1).of(yup.number()).required()
  }),
  NR: yup.object().shape({
    ...baseSchema,
    prefixes: yup.array().min(1).of(yup.string().trim().max(64)),
    suffixes: yup.array().min(1).of(yup.string().trim().max(64)),
    correct: yup.array().min(1).of(yup.number()).required()
  }),
  SC: yup.object().shape({
    ...baseSchema,
    answers: yup.array().min(2).of(yup.string().trim().min(1).max(500).required()).required(),
    correct: yup.number().required()
  }),
  TR: yup.object().shape({
    ...baseSchema,
    correct: yup.string().trim().min(1).max(7000).required()
  }),
  TF: yup.object().shape({
    ...baseSchema,
    correct: yup.boolean().required()
  }),
  FB: yup.object().shape({
    ...baseSchema,
    question: fbQuestion,
    correct: yup.array().of(yup.array().min(1).of(yup.string().trim().min(1).max(200).required()))
  }),
  MQ: yup.object().shape({
    ...baseSchema,
    premises: yup.array().of(objectMap),
    responses: yup.array().of(objectMap),
    headings: yup.object().shape({
      premise: yup.string().trim().min(1).max(200).required(),
      response: yup.string().trim().min(1).max(200).required()
    })
  }),
  DD: yup.object().shape({
    ...baseSchema,
    groups: yup.array().castMap().of(objectMap).min(2),
    answers: yup.array().castMap().of(objectMap),
    correct: yup.array().castMap().of(yup.object().shape({
      key: yup.string().required(),
      value: yup.array().of(yup.string().required()).min(1)
    })).min(1)
  })
};

export function errorProcessor(error) {
  const item = error.value;
  if (item.type !== 'DD') return map(error.inner, it => it.path);
  // TODO: Nasty !!
  return map(error.inner, it => {
    const path = toPath(it.path);
    if (path.length === 1) return it.path;
    if (last(path) !== 'value') return;
    const key = get(error.value, dropRight(path).concat('key'));
    return `${path[0]}${key}`;
  });
}

const baseDefaults = {
  question: [],
  hint: ''
};

export const defaults = {
  MC: () => ({
    type: 'MC',
    ...baseDefaults,
    answers: ['', '', ''],
    correct: []
  }),
  NR: () => ({
    type: 'NR',
    ...baseDefaults,
    prefixes: [''],
    suffixes: [''],
    correct: ['']
  }),
  SC: () => ({
    type: 'SC',
    ...baseDefaults,
    answers: ['', ''],
    correct: ''
  }),
  TR: () => ({
    type: 'TR',
    ...baseDefaults,
    correct: ''
  }),
  TF: () => ({
    type: 'TF',
    ...baseDefaults,
    correct: null
  }),
  FB: () => ({
    type: 'FB',
    ...baseDefaults,
    correct: []
  }),
  MQ() {
    const element = {
      type: 'MQ',
      ...baseDefaults,
      premises: [],
      responses: [],
      correct: {},
      headings: {
        premise: 'Premise',
        response: 'Response'
      }
    };
    times(2, () => {
      const premiseKey = cuid();
      const responseKey = cuid();
      element.premises.push({ key: premiseKey, value: '' });
      element.responses.push({ key: responseKey, value: '' });
      element.correct[premiseKey] = responseKey;
    });
    return element;
  },
  DD() {
    const element = {
      type: 'DD',
      ...baseDefaults,
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
  }
};
