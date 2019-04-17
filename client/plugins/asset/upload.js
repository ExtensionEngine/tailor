import pick from 'lodash/pick';

export const install = (Vue, options = {}) => {
  const { apiUrl, upload, basename, direct, defaultTag } = options;
  const ResourceUpload = Vue.component('resource-upload');
  Vue.component('asset-upload', {
    render(createElement, { props, data, children }) {
      data.props = {
        ...pick(props, ['direct', 'accept', 'tag']),
        action: apiUrl,
        upload,
        basename
      };
      return createElement(ResourceUpload, data, children);
    },
    functional: true,
    props: {
      ...pick(ResourceUpload.options.props, ['accept']),
      direct: { type: Boolean, default: () => direct },
      tag: { type: String, default: () => defaultTag }
    }
  });
};

export default install;
