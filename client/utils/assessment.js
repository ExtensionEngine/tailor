import find from 'lodash/find';
import yup from 'yup';

export const typeInfo = {
  MC: { type: 'MC', title: 'Multiple choice', class: 'multiple-choice' },
  SC: { type: 'SC', title: 'Single choice', class: 'single-choice' },
  TR: { type: 'TR', title: 'Text response', class: 'text-response' },
  NR: { type: 'NR', title: 'Numerical response', class: 'numerical-response' },
  TF: { type: 'TF', title: 'True - false', class: 'true-false' },
  FB: { type: 'FB', title: 'Fill in the blank', class: 'fill-blank' },
  MQ: { type: 'MQ', title: 'Matching question', class: 'matching-question' }
};

export const helperText = {
  FB: { question: 'Type "@blank" when new blank is needed.' }
};

const BLANK_PLACEHOLDER = /(@blank)/g;

function containsText(asset) {
  return asset.type === 'HTML' &&
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

export const schemas = {
  MC: yup.object().shape({
    question,
    answers: yup.array().min(2).of(yup.string().trim().min(1)).required(),
    correct: yup.array().min(1).of(yup.number()).required()
  }),
  NR: yup.object().shape({
    question,
    correct: yup.string().trim().matches(/^(^\d+$)|(^\d+\.\d+$)$/).required()
  }),
  SC: yup.object().shape({
    question,
    answers: yup.array().min(2).of(yup.string().trim().min(1)).required(),
    correct: yup.number().required()
  }),
  TR: yup.object().shape({
    question,
    correct: yup.string().trim().min(1).required()
  }),
  TF: yup.object().shape({
    question,
    correct: yup.boolean().required()
  }),
  FB: yup.object().shape({
    question: fbQuestion,
    correct: yup.array().of(yup.array().min(1).of(yup.string().trim().min(1).required()))
  }),
  MQ: yup.object().shape({
    question,
    correct: yup.array().of(yup.object().shape({
      premise: yup.string().trim().notOneOf(['Click to edit']).required(),
      response: yup.string().trim().notOneOf(['Click to edit']).required()
    })).min(2).required()
  })
};

export const defaults = {
  MC: {
    type: 'MC',
    question: [],
    answers: ['', '', ''],
    correct: [],
    hint: ''
  },
  NR: {
    type: 'NR',
    question: [],
    correct: '',
    hint: ''
  },
  SC: {
    type: 'SC',
    question: [],
    answers: ['', ''],
    correct: '',
    hint: ''
  },
  TR: {
    type: 'TR',
    question: [],
    correct: '',
    hint: ''
  },
  TF: {
    type: 'TF',
    question: [],
    correct: null,
    hint: ''
  },
  FB: {
    type: 'FB',
    question: [],
    correct: []
  },
  MQ: {
    type: 'MQ',
    question: [],
    correct: [],
    hint: ''
  }
};
