import ComponentRegistry from './ComponentRegistry';
import containerList from 'shared/core-containers';
import { getContainerName } from 'tce-core/utils';

const ATTRS = ['type', 'templateId', 'version'];
const getCondition = templateId => it => it.templateId === templateId;
const options = ['container', containerList, ATTRS, getContainerName, getCondition];

export default Vue => new ComponentRegistry(Vue, ...options);
