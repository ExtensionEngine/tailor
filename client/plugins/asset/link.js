import pick from 'lodash/pick';
import normalizeUrl from 'normalize-url';

export const install = (Vue, { apiUrl, direct, defaultProtocol } = {}) => {
  const ResourceLink = Vue.component('resource-link');
  Vue.component('asset-link', {
    render(createElement, { props, data, children }) {
      data.props = pick(props, ['direct', 'download', 'target']);
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
