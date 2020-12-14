'use strict';

const { ClientCredentials } = require('simple-oauth2');
const config = require('../../../config/server/publish');
const Deferred = require('../../shared/util/Deferred');
const request = require('axios');

const clientId = config.clientID;
const clientSecret = config.clientSecret;
const tokenHost = config.tokenHost;
const tokenPath = config.tokenPath;
const webhookUrl = config.webhookUrl;
const client = new ClientCredentials({
  client: { id: clientId, secret: clientSecret },
  auth: { tokenHost, tokenPath }
});
const deferred = new Deferred();

deferred.promise = getAccessToken();

let accessToken = deferred.resolve();

async function send(payload) {
  if (!accessToken || accessToken.expired()) {
    accessToken = await getAccessToken();
  }
  return request.post(webhookUrl, payload, {
    headers: { Authorization: `Bearer ${accessToken.token.access_token}` }
  });
}

function getAccessToken() {
  return client.getToken()
    .catch(error => console.error('Access Token Error', error.message));
}

module.exports = { send };
