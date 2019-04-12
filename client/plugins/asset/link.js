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
      const href = normalizeUrl(props.href, { defaultProtocol });
      const action = !props.direct ? apiUrl : '';
      Object.assign(data.props, { action, href });
      return createElement(ResourceLink, data, children);
    },
    functional: true,
    props: {
      ...pick(ResourceLink.options.props, ['href', 'download', 'target']),
      direct: { type: Boolean, default: () => direct }
    }
  });
};

export default install;
