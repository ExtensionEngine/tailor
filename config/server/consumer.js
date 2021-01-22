'use strict';

const { env } = process;

module.exports = {
  webhookUrl: env.CONSUMER_WEBHOOK_URL,
  clientId: env.CONSUMER_CLIENT_ID,
  clientSecret: env.CONSUMER_CLIENT_SECRET,
  tokenHost: env.CONSUMER_CLIENT_TOKEN_HOST,
  tokenPath: env.CONSUMER_CLIENT_TOKEN_PATH
};
