import ComponentRegistry from './ComponentRegistry';
import containerList from 'shared/core-containers';
import { getContainerName } from 'tce-core/utils';

const ATTRS = ['type', 'version'];
const options = ['content container', containerList, ATTRS, getContainerName];

export default Vue => new ComponentRegistry(Vue, ...options);
