import { EventEmitter } from 'events';
import join from 'url-join';

const isProduction = process.env.NODE_ENV === 'production';
const SILENT_REFRESH_TIMEOUT = 5000;

class OidcClient {
  constructor() {
    this.enabled = process.env.OIDC_ENABLED;
    this.logoutEnabled = process.env.OIDC_LOGOUT_ENABLED;
    this.baseUrl = join(process.env.API_PATH, 'oidc');
  }

  get silentUrl() {
    const url = new URL(this.baseUrl, window.location.href);
    url.searchParams.set('silent', true);
    return url;
  }

  get resignUrl() {
    const url = new URL(this.baseUrl, window.location.href);
    url.searchParams.set('resign', true);
    return url;
  }

  get logoutUrl() {
    const url = new URL(this.baseUrl, window.location.href);
    url.searchParams.set('action', 'logout');
    return url;
  }

  authenticate() {
    window.location.replace(this.baseUrl);
  }

  reauthenticate() {
    window.location.replace(this.resignUrl);
  }

  logout() {
    window.location.replace(this.logoutUrl);
  }

  slientlyRefresh() {
    return new Promise((resolve, reject) => {
      const iframe = new RefreshIframe(this.silentUrl, SILENT_REFRESH_TIMEOUT);
      iframe.on('auth:success', () => resolve('auth:success'));
      iframe.on('auth:fail', () => reject(new Error('auth:fail')));
    });
  }
}

export default {
  install(Vue) {
    const oidcClient = new OidcClient();
    Vue.prototype.$oidc = oidcClient;
    Vue.oidc = oidcClient;
  }
};

class RefreshIframe extends EventEmitter {
  constructor(src, timeout) {
    super();
    this._iframe = window.document.createElement('iframe');
    Object.assign(this._iframe.style, {
      visibility: 'hidden',
      position: 'absolute',
      display: 'none',
      width: 0,
      height: 0
    });
    this._iframe.src = src;
    this.mount();
    this._iframe.contentWindow.addEventListener('auth:success', () => this.onSuccess());
    this._iframe.contentWindow.addEventListener('auth:fail', () => this.onFail());
    if (isProduction && timeout) {
      this._timeout = setTimeout(() => this.onFail(), timeout);
    }
  }

  mount() {
    window.document.body.appendChild(this._iframe);
  }

  destroy() {
    window.document.body.removeChild(this._iframe);
    clearTimeout(this._timeout);
    this._timeout = null;
  }

  onSuccess() {
    this.emit('auth:success');
    this.destroy();
  }

  onFail() {
    this.emit('auth:fail');
    this.destroy();
  }
}
