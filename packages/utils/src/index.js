import toCase from 'to-case';

export * from './calculatePosition';
export * as activity from './activity';
export { default as InsertLocation } from './InsertLocation';
export * as assessment from './assessment';
export * as Events from './events';
export { default as numberToLetter } from './numberToLetter';
export { default as publishDiffChangeTypes } from './publishDiffChangeTypes';
export { default as uuid } from './uuid';

export function getMetaName(type) {
  return `meta-${toCase.slug(type)}`;
}

export function getContainerName(type) {
  return `tcc-${toCase.slug(type)}`;
}

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
  return element && (element.uid || element.id);
}
