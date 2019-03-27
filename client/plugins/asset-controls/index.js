import AssetLink from './AssetLink';

export const install = (Vue, { apiUrl, auth } = {}) => {
  Vue.component(AssetLink.name, {
    $_apiUrl: apiUrl,
    $_auth: auth,
    extends: AssetLink
  });
};

export default install;
