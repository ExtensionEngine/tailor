'use strict';

const isLocalhost = require('is-localhost');
const parse = require('url-parse');

const hostname = resolveHostname();
const protocol = resolveProtocol(hostname);
const port = resolvePort();
const host = resolveHost(hostname, protocol, port);

module.exports = {
  host,
  hostname,
  protocol,
  port
};

// Legacy config support
function resolveHostname() {
  const { HOSTNAME, SERVER_URL } = process.env;
  if (HOSTNAME) return HOSTNAME;
  const LEGACY_HOSTNAME = parse(SERVER_URL).hostname;
  return LEGACY_HOSTNAME || '127.0.0.1';
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

function resolveHost(hostname = '127.0.0.1', protocol = 'http', port = 3000) {
  return `${protocol}://${hostname}${isLocalhost(hostname) ? `:${port}` : ''}`;
}
