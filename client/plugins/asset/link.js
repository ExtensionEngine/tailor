import pick from 'lodash/pick';
import normalizeUrl from 'normalize-url';

const isProduction = process.env.NODE_ENV === 'production';

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
        const url = normalizeUrl(props.href, { defaultProtocol });
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
