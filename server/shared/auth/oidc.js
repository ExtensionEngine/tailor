import { Strategy as BaseOIDCStrategy, Issuer } from 'openid-client';
import { URL } from 'node:url';

export default class OIDCStrategy extends BaseOIDCStrategy {
  constructor(options, verify) {
    const issuer = createIssuer(options);
    const client = createClient(issuer, options);
    super({ client }, function (tokenSet, userInfo, done) {
      const profile = parseUserInfo(userInfo);
      return verify.call(this, tokenSet, profile, done);
    });
    this.options = options;
  }

  get client() {
    return this._client;
  }

  get issuer() {
    return this._issuer;
  }

  get isLogoutEnabled() {
    return this.options.logoutEnabled;
  }

  logoutUrl({ oidcData, ...params } = {}) {
    const { client } = this;
    const url = new URL(client.endSessionUrl({
      ...params,
      client_id: client.client_id,
      id_token_hint: oidcData.tokenSet.id_token
    }));
    const customRedirectUriKey = this.options.postLogoutUriKey;
    if (!customRedirectUriKey) return url.href;
    const redirectUri = url.searchParams.get('post_logout_redirect_uri');
    url.searchParams.set(customRedirectUriKey, redirectUri);
    return url.href;
  }

  logout(params) {
    return (req, res) => {
      req.logout();
      const { oidc: oidcData } = req.authData;
      res.redirect(this.logoutUrl({ ...params, oidcData }));
    };
  }
}

function createIssuer(options) {
  return new Issuer({
    issuer: options.issuer,
    jwks_uri: options.jwksURL,
    authorization_endpoint: options.authorizationEndpoint,
    token_endpoint: options.tokenEndpoint,
    userinfo_endpoint: options.userInfoEndpoint,
    end_session_endpoint: options.logoutEndpoint
  });
}

function createClient(issuer, { callbackURL, clientID, clientSecret }) {
  const redirectUri = new URL(callbackURL);
  const postLogoutRedirectUri = new URL(callbackURL);
  postLogoutRedirectUri.searchParams.set('action', 'logout');
  return new issuer.Client({
    client_id: clientID,
    client_secret: clientSecret,
    redirect_uris: [redirectUri.href],
    post_logout_redirect_uris: [postLogoutRedirectUri.href],
    response_types: ['code']
  });
}

function parseUserInfo(userInfo) {
  return {
    id: userInfo.sub,
    username: userInfo.username,
    email: userInfo.email,
    firstName: userInfo.given_name,
    lastName: userInfo.family_name,
    verified: userInfo.email_verified
  };
}
