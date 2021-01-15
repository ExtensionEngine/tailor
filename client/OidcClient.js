import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const SILENT_REFRESH_TIMEOUT = 5000;

class OidcClient {
  constructor() {
    this.enabled = process.env.OIDC_ENABLED;
    this.baseUrl = path.join(process.env.API_PATH, '/oidc');
    this._silentRefreshTimeout = null;
  }

  _getSilentUrl() {
    const url = new URL(this.baseUrl, window.location.href);
    url.searchParams.set('silent', true);
    return url;
  }

  _getResignUrl() {
    const url = new URL(this.baseUrl, window.location.href);
    url.searchParams.set('resign', true);
    return url;
  }

  _getLogoutUrl() {
    const url = new URL(this.baseUrl, window.location.href);
    url.searchParams.set('action', 'logout');
    return url;
  }

  authenticate() {
    window.location.replace(this.baseUrl);
  }

  reauthenticate() {
    window.location.replace(this._getResignUrl());
  }

  logout() {
    window.location.replace(this._getLogoutUrl());
  }

  slientlyRefresh() {
    return new Promise((resolve, reject) => {
      const iframe = window.document.createElement('iframe');
      iframe.style.visibility = 'hidden';
      iframe.style.position = 'absolute';
      iframe.style.display = 'none';
      iframe.style.width = 0;
      iframe.style.height = 0;
      iframe.src = this._getSilentUrl();
      window.document.body.appendChild(iframe);
      const getCallback = (success = true) => () => {
        clearTimeout(this._silentRefreshTimeout);
        this._silentRefreshTimeout = null;
        window.document.body.removeChild(iframe);
        this.active = success;
        return success ? resolve('auth:success') : reject(new Error('auth:fail'));
      };
      iframe.contentWindow.addEventListener('auth:success', getCallback());
      iframe.contentWindow.addEventListener('auth:fail', getCallback(false));
      if (isProduction) {
        this._silentRefreshTimeout = setTimeout(getCallback(false), SILENT_REFRESH_TIMEOUT);
      }
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
