'use strict';

const {
  clientID: clientId,
  clientSecret,
  tokenHost,
  tokenPath,
  webhookUrl
} = require('../../config/server/consumer');
const { ClientCredentials } = require('simple-oauth2');
const Deferred = require('./util/Deferred');
const request = require('axios');

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
