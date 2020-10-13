import ComponentRegistry from './ComponentRegistry';
import { getMetaName } from 'tce-core/utils';
import inputsList from 'shared/core-meta';

const ATTRS = ['type', 'version'];
const options = ['meta input', inputsList, ATTRS, getMetaName];

export default Vue => new ComponentRegistry(Vue, ...options);
