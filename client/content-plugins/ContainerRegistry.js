import ComponentRegistry from './ComponentRegistry';
import containerList from 'shared/core-containers';
import { getContainerTemplateId as getId } from 'shared/activities';
import { getContainerName as getName } from 'tce-core/utils';

const validator = ({ templateId, type }) => {
  if (templateId) return;
  console.warn(`
    For container ${type} using depricated type identification!
    Use templateId instead!
  `);
};

export default Vue => new ComponentRegistry(Vue, {
  name: 'content container',
  extensions: containerList,
  attrs: ['type', 'templateId', 'version'],
  getCondition: id => it => getId(it) === id,
  validator,
  getName
});
