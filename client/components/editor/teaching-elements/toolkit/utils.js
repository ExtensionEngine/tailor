import toCase from 'to-case';

export function getComponentName(type) {
  return `content-${toCase.slug(type)}`;
}

export function getElementId(element) {
  return element._cid || element.id;
}
