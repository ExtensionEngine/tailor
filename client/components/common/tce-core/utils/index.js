import toCase from 'to-case';

export { default as calculatePosition } from './calculatePosition';

export { default as downloadMixin } from './downloadMixin';

export * from './validation';

export function getComponentName(type) {
  return `tce-${toCase.slug(resolveElementType(type))}`;
}

export function processAnswerType(type) {
  return `answer-${toCase.slug(type)}`;
}

export function isQuestion(type) {
  return ['QUESTION', 'REFLECTION', 'ASSESSMENT'].includes(type);
}

export function resolveElementType(type) {
  return isQuestion(type) ? 'QUESTION-CONTAINER' : type;
}

export function getToolbarName(type) {
  return `${toCase.slug(type)}-toolbar`;
}

export function getElementId(element) {
  return element && (element._cid || element.id);
}
