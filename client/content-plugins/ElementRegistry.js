import ComponentRegistry from './ComponentRegistry';
import elementList from 'shared/core-elements';
import { getComponentName } from 'tce-core/utils';

const ATTRS = ['name', 'type', 'subtype', 'version', 'schema', 'initState', 'ui'];
const options = ['content element', elementList, ATTRS, getComponentName];

export default Vue => new ComponentRegistry(Vue, ...options);
