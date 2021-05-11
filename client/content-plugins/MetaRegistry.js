import ComponentRegistry from './ComponentRegistry';
import { getMetaName as getName } from '@tailor-cms/utils';
import inputsList from 'shared/core-meta';

export default Vue => new ComponentRegistry(Vue, {
  name: 'meta input',
  extensions: inputsList,
  attrs: ['type', 'version'],
  getCondition: type => it => it.type === type,
  getName
});
