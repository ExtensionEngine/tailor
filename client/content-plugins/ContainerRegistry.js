import ComponentRegistry from './ComponentRegistry';
import containerList from 'shared/core-containers';
import { getContainerName as getName } from 'tce-core/utils';

export default Vue => new ComponentRegistry(Vue, {
  name: 'content container',
  extensions: containerList,
  attrs: ['type', 'templateId', 'version'],
  getCondition: id => it => it.templateId === id || it.type === id,
  getName
});
