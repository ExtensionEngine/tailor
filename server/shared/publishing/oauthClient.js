'use strict';

const { ClientCredentials } = require('simple-oauth2');
const config = require('../../../config/server/publish');

const clientId = config.clientID;
const clientSecret = config.clientSecret;
const tokenHost = config.tokenHost;
const tokenPath = config.tokenPath;
const clientConfig = {
  client: { id: clientId, secret: clientSecret },
  auth: { tokenHost, tokenPath }
};

module.exports = new ClientCredentials(clientConfig);
