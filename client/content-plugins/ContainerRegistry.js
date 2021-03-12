import ComponentRegistry from './ComponentRegistry';
import containerList from 'shared/core-containers';
import get from 'lodash/get';
import { getContainerTemplateId as getId } from '@tailor/config';
import { getContainerName as getName } from 'tce-core/utils';
import { service as ValidationService } from './validation';

const getTemplateMessage = name => `
  For container ${name} using deprecated 'type' identification!
  Use 'templateId' instead!
`;

const getElementsMessage = name => `
  For container ${name} using deprecated 'tes' prop!
  Use 'elements' instead!
`;

const validator = ({ Edit: template, templateId, type }) => {
  const name = templateId || type;

  ValidationService
    .validate(!templateId, getTemplateMessage(name))
    .validate(get(template, 'props.tes'), getElementsMessage(name));
};

export default Vue => new ComponentRegistry(Vue, {
  name: 'content container',
  extensions: containerList,
  attrs: ['type', 'templateId', 'version'],
  getCondition: id => it => getId(it) === id,
  validator,
  getName
});
