import ResourceComponents from '../resource-components';
import AssetLink from './link';
import AssetUpload from './upload';

export const install = (Vue, { auth, apiUrl, link, upload } = {}) => {
  Vue.use(ResourceComponents, { auth });
  Vue.use(AssetLink, { ...link, apiUrl });
  Vue.use(AssetUpload, { ...upload, apiUrl });
};

export default install;
