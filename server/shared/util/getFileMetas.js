'use strict';

const FILE_ELEMENT_TYPE = 'FILE';

function getMetaByActivityType(structure = []) {
  return structure.reduce((acc, { type, meta }) => {
    const fileMetaKeys = getFileMetaKeys(meta);
    if (!fileMetaKeys.length) return acc;
    return { ...acc, [type]: fileMetaKeys };
  }, {});
}

function getMetaByElementType(elementMeta = []) {
  return elementMeta.reduce((acc, { type, inputs }) => {
    const fileMetaKeys = getFileMetaKeys(inputs);
    if (!fileMetaKeys.length) return acc;
    return { ...acc, [type]: fileMetaKeys };
  }, {});
}

function getFileMetaKeys(meta = []) {
  return meta.filter(it => it.type === FILE_ELEMENT_TYPE).map(it => it.key);
}

module.exports = schemas => {
  return schemas.reduce((acc, { id, meta, structure, elementMeta }) => {
    return {
      ...acc,
      [id]: {
        repository: getFileMetaKeys(meta),
        activity: getMetaByActivityType(structure),
        element: getMetaByElementType(elementMeta)
      }
    };
  }, {});
};
