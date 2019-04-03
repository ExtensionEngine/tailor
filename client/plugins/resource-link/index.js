import ResourceLink from './ResourceLink';

export const install = (Vue, { auth } = {}) => {
  Vue.component(ResourceLink.name, {
    $_auth: auth,
    extends: ResourceLink
  });
};

export default install;
