import pick from 'lodash/pick';

export const install = (Vue, options = {}) => {
  const { apiUrl, upload, getUploadConfig, defaultTag } = options;
  const ResourceUpload = Vue.component('resource-upload');
  Vue.component('asset-upload', {
    render(createElement, { props, data, children }) {
      data.props = {
        ...pick(props, ['direct', 'accept', 'tag']),
        action: apiUrl,
        preflight: getUploadConfig,
        upload
      };
      return createElement(ResourceUpload, data, children);
    },
    functional: true,
    props: {
      ...pick(ResourceUpload.options.props, ['accept']),
      tag: { type: String, default: () => defaultTag }
    }
  });
};

export default install;
