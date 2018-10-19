import toCase from 'to-case';

export function getComponentName(type) {
  return `content-${toCase.slug(type)}`;
}

export function getToolbarName(type) {
  return `${toCase.slug(type)}-toolbar`;
}

export function getElementId(element) {
  return element._cid || element.id;
}
