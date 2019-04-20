import ResourceComponents from '@extensionengine/resource-components';
import * as AssetLink from './link';
import * as AssetUpload from './upload';

import '@extensionengine/resource-components/dist/resource-components.css';

export const install = (Vue, { auth, apiUrl, link, upload } = {}) => {
  Vue.use(ResourceComponents, { auth });
  AssetLink.install(Vue, { ...link, apiUrl });
  AssetUpload.install(Vue, { ...upload, apiUrl });
};

export default install;
