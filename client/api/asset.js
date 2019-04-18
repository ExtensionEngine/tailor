import axios from 'axios';
import crypto from 'crypto';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import normalizeUrl from 'normalize-url';
import path from 'path';
import request from './request';
import urlJoin from 'url-join';

const url = {
  root: () => '/asset'
};

export const apiUrl = path.join(request.defaults.baseURL, url.root());
export const protocol = 'storage://';

const reader = {
  'document': findText,
  json: get,
  default: get
};

function findText(xmldoc, xpath) {
  const node = xmldoc.evaluate(xpath, xmldoc).iterateNext();
  return node && node.textContent;
}

export async function getPublicUrl(url) {
  url = normalizeUrl(url, { defaultProtocol: protocol });
  const params = { url };
  const resp = await request.get(url.root(), { params });
  return resp.data.url;
}

export async function upload(file, { url, fields = {}, response = {} }) {
  const form = new FormData();
  forEach(fields, (value, name) => form.append(name, value));
  // NOTE: `file` needs to be last field inside the form in order for s3 browser
  //        based upload to work: https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-post-example.html
  form.append('file', file, file.name);
  const responseType = response.type || 'json';
  const resp = await axios.post(url, form, { responseType });
  const readValue = reader[responseType] || reader.default;
  const data = mapValues(response.keys, path => readValue(resp.data, path));
  return Object.assign(data, {
    filename: file.name,
    url: urlJoin(protocol, data.key)
  });
}

export async function pathname(file, { maxLength = 180 } = {}) {
  const filename = file.name;
  const contents = await toBuffer(file);
  const hash = sha256(filename, contents);
  const extension = path.extname(filename);
  const name = path.basename(filename, extension).substring(0, maxLength).trim();
  return `${hash}___${name}${extension}`;
}

function toBuffer(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = event => resolve(event.target.result);
    reader.readAsArrayBuffer(file);
  });
}

function sha256(...args) {
  const hash = crypto.createHash('sha256');
  args.forEach(arg => hash.update(arg));
  return hash.digest('hex');
}
