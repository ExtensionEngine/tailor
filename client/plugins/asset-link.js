const isProduction = process.env.NODE_ENV === 'production';

export const install = (Vue, { apiUrl } = {}) => {
  const ResourceLink = Vue.component('resource-link');
  if (!ResourceLink) {
    return !isProduction &&
      Vue.util.warn('Cannot find `<resource-link>` component.');
  }
  Vue.component('asset-link', {
    render(createElement, { props, data, children }) {
      data.props = {
        action: apiUrl,
        download: props.download,
        target: props.target,
        params: { url: props.href }
      };
      return createElement(ResourceLink, data, children);
    },
    functional: true,
    props: {
      ...pick(ResourceLink.options.props, ['download', 'target']),
      href: { type: String, required: true }
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
