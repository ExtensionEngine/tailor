import * as ResourceComponents from '../resource-components';
import * as AssetLink from './link';
import * as AssetUpload from './upload';

export const install = (Vue, { auth, apiUrl, link, upload } = {}) => {
  ResourceComponents.install(Vue, { auth });
  AssetLink.install(Vue, { ...link, apiUrl });
  AssetUpload.install(Vue, { ...upload, apiUrl });
};

export default install;
