'use strict';

const { env } = process;

module.exports = {
  webhookUrl: env.PUBLISH_WEBHOOK_URL,
  clientID: env.PUBLISH_CLIENT_ID,
  clientSecret: env.PUBLISH_CLIENT_SECRET,
  tokenHost: env.PUBLISH_CLIENT_TOKEN_HOST,
  tokenPath: env.PUBLISH_CLIENT_TOKEN_PATH
};
