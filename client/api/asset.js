import axios from 'axios';
import forEach from 'lodash/forEach';
import normalizeUrl from 'normalize-url';
import path from 'path';
import request from './request';
import urlJoin from 'url-join';

const url = {
  root: () => '/asset'
};

export const apiUrl = path.join(request.defaults.baseURL, url.root());
export const protocol = 'storage://';

export async function getPublicUrl(url) {
  url = normalizeUrl(url, { defaultProtocol: protocol });
  const params = { url };
  const resp = await request.get(url.root(), { params });
  return resp.data.url;
}

export async function upload(file, { url, params }) {
  const form = new FormData();
  form.append('file', file, file.name);
  forEach(params, (value, name) => form.append(name, value));
  const resp = await axios.post(url, form);
  const { data } = resp;
  return Object.assign(data, { url: urlJoin(protocol, data.key) });
}
