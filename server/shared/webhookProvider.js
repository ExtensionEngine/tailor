import { ClientCredentials } from 'simple-oauth2';
import config from '../../config/server/consumer.js';
import request from 'axios';
import yup from 'yup';

const schema = yup.object().shape({
  webhookUrl: yup.string().url().required(),
  clientId: yup.string().required(),
  clientSecret: yup.string().required(),
  tokenHost: yup.string().url().required(),
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

export default createWebhookProvider();
