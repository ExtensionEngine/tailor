const isProduction = process.env.NODE_ENV === 'production';
const reProtocol = /^[a-z0-9.+-]+:\/\//i;

export const install = (Vue, { apiUrl, direct, defaultProtocol } = {}) => {
  const ResourceLink = Vue.component('resource-link');
  if (!ResourceLink) {
    return !isProduction &&
      Vue.util.warn('Can\'t find `<resource-link>` component.');
  }
  Vue.component('asset-link', {
    render(createElement, { props, data, children }) {
      data.props = pick(props, ['download', 'target', 'direct']);
      if (props.direct) {
        Object.assign(data.props, { url: props.href });
      } else {
        const url = prependProtocol(props.href, defaultProtocol);
        Object.assign(data.props, { url: apiUrl, params: { url } });
      }
      return createElement(ResourceLink, data, children);
    },
    functional: true,
    props: {
      ...pick(ResourceLink.options.props, ['download', 'target']),
      direct: { type: Boolean, default: () => direct },
      href: { type: String, required: true }
    }
  });
};

export default install;

function prependProtocol(url, protocol) {
  if (reProtocol.test(url)) return url;
  return url.replace(/^(?!(?:\w+:)?\/\/)/, protocol);
}

function pick(source, props = []) {
  return props.reduce((acc, prop) => {
    if (!(prop in source)) return acc;
    return Object.assign(acc, { [prop]: source[prop] });
  }, {});
}
