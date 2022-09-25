import 'dotenv/config';

import * as auth from './auth.js';
import * as consumer from './consumer.js';
import * as mail from './mail.js';
import * as storage from './storage.js';
import * as store from './store.js';
import * as tce from './tce.js';
import isLocalhost from 'is-localhost';
import parse from 'url-parse';

const hostname = resolveHostname();
const protocol = resolveProtocol(hostname);
const port = resolvePort();
const origin = resolveOrigin(hostname, protocol, port);
const previewUrl = process.env.PREVIEW_URL;

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

export {
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

export default {
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
