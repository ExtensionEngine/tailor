import ResourceLink from './ResourceLink';
import ResourceUpload from './ResourceUpload';

export const install = (Vue, { auth } = {}) => {
  Vue.component(ResourceLink.name, {
    $_auth: auth,
    extends: ResourceLink
  });
  Vue.component(ResourceUpload.name, {
    $_auth: auth,
    extends: ResourceUpload
  });
};

export default install;
