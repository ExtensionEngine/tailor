const isProduction = process.env.NODE_ENV === 'production';

export const install = (Vue, { apiUrl, direct, defaultTag } = {}) => {
  const ResourceUpload = Vue.component('resource-upload');
  if (!ResourceUpload) {
    return !isProduction &&
      Vue.util.warn('Can\'t find `<resource-upload>` component.');
  }
  Vue.component('asset-upload', {
    render(createElement, { props, data, children }) {
      data.props = {
        ...pick(props, ['accept', 'direct', 'tag']),
        url: apiUrl
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

function pick(source, props = []) {
  return props.reduce((acc, prop) => {
    if (!(prop in source)) return acc;
    return Object.assign(acc, { [prop]: source[prop] });
  }, {});
}
