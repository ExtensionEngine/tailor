'use strict';

const auth = require('./auth');
const consumer = require('./consumer');
const isIp = require('is-ip');
const isLocalhost = require('is-localhost');
const mail = require('./mail');
const parse = require('url-parse');
const storage = require('./storage');
const store = require('./store');
const tce = require('./tce');

const hostname = resolveHostname();
const protocol = resolveProtocol(hostname);
const port = resolvePort();
const origin = resolveOrigin(hostname, protocol, port);
const previewUrl = process.env.PREVIEW_URL;

validateStorageProxy(storage.proxy, hostname);

module.exports = {
  protocol,
  hostname,
  port,
  origin,
  auth,
  mail,
  storage,
  previewUrl,
  consumer,
  store,
  tce
};

// Legacy config support
function resolveHostname() {
  const { HOSTNAME, SERVER_URL } = process.env;
  if (HOSTNAME) return HOSTNAME;
  const LEGACY_HOSTNAME = parse(SERVER_URL).hostname;
  return LEGACY_HOSTNAME || 'localhost';
}

function resolveProtocol(hostname) {
  const { PROTOCOL } = process.env;
  if (PROTOCOL) return PROTOCOL;
  return isLocalhost(hostname) ? 'http' : 'https';
}

function resolvePort() {
  const { PORT, SERVER_PORT } = process.env;
  return PORT || SERVER_PORT || 3000;
}

function resolveOrigin(hostname = 'localhost', protocol = 'http', port = 3000) {
  return `${protocol}://${hostname}${resolveOriginPort(hostname)}`;
}

function resolveOriginPort(hostname) {
  const { REVERSE_PROXY_PORT } = process.env;
  if (!REVERSE_PROXY_PORT) return `:${port}`;
  if (REVERSE_PROXY_PORT === '80' || REVERSE_PROXY_PORT === '443') return '';
  return `:${REVERSE_PROXY_PORT}`;
}

function validateStorageProxy(proxy, hostname) {
  if (isIp.v4(hostname) && /cloudfront/i.test(proxy.provider)) {
    throw new Error('CloudFront storage proxy cannot be used alongside IPv4 host name');
  }
}
