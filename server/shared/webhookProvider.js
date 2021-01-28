'use strict';

const { ClientCredentials } = require('simple-oauth2');
const config = require('../../config/server/consumer');
const request = require('axios');
const yup = require('yup');

const schema = yup.object().shape({
  webhookUrl: yup.string().required(),
  clientId: yup.string().required(),
  clientSecret: yup.string().required(),
  tokenHost: yup.string().required(),
  tokenPath: yup.string().required()
});

function createWebhookProvider() {
  if (!config.webhookUrl) return { isConnected: false };
  const {
    clientId,
    clientSecret,
    tokenHost,
    tokenPath,
    webhookUrl
  } = schema.validateSync(config, { stripUnknown: true });

  const client = new ClientCredentials({
    client: { id: clientId, secret: clientSecret },
    auth: { tokenHost, tokenPath }
  });
  let accessToken;

  getAccessToken();

  return { send, isConnected: true };

  async function send(payload) {
    if (!accessToken || accessToken.expired()) {
      await getAccessToken();
    }
    return request.post(webhookUrl, payload, {
      headers: { Authorization: `Bearer ${accessToken.token.access_token}` }
    });
  }

  function getAccessToken() {
    return client.getToken()
      .then(token => { accessToken = token; })
      .catch(error => console.error('Access Token Error', error.message));
  }
}

module.exports = createWebhookProvider();
