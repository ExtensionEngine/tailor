import ComponentRegistry from './ComponentRegistry';
import elementList from 'shared/core-elements';
import { getComponentName } from 'tce-core/utils';

const ATTRS = ['name', 'type', 'subtype', 'version', 'schema', 'initState', 'ui'];
const getCondition = type => it => it.subtype === type || it.type === type;
const options = ['element', elementList, ATTRS, getComponentName, getCondition];

export default Vue => new ComponentRegistry(Vue, ...options);
