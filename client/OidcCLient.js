import path from 'path';

class OidcCLient {
  constructor() {
    this.enabled = process.env.OIDC_ENABLED;
    this.baseUrl = path.join(process.env.API_PATH, '/oidc');
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

  authenticate() {
    window.location.replace(this.baseUrl);
  }

  reauthenticate() {
    window.location.replace(this._getResignUrl());
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
      iframe.contentWindow.addEventListener('auth:success', e => {
        window.document.body.removeChild(iframe);
        resolve('auth:success');
      });
      iframe.contentWindow.addEventListener('auth:error', e => {
        window.document.body.removeChild(iframe);
        reject(new Error('auth:error'));
      });
    });
  }
}

export default {
  install(Vue) {
    const oidcClient = new OidcCLient();
    Vue.prototype.$oidc = oidcClient;
    Vue.oidc = oidcClient;
  }
};
