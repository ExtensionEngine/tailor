import assign from 'lodash/assign';
import cuid from 'cuid';
import isArray from 'lodash/isArray';
import join from 'url-join';
import omit from 'lodash/omit';
import Queue from 'promise-queue';

import axios from './request';

// used to serialize api calls that modify data
const queue = new Queue(1, Infinity);

export default class Resource {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = queue;
    this.mappings = {};
  }

  url(path = '') {
    return join(this.baseUrl, path);
  }

  /**
   * Get client id based on server id.
   * @param {string} _key
   */
  getCid(_key) {
    return this.mappings[_key];
  }

  /**
   * Generate client id for provided model.
   * @param {object} model
   */
  setCid(model) {
    model._cid = this.getCid(model._key) || cuid();
    if (model._key) this.map(model._cid, model._key);
  }

  /**
   * Get server id based on client id.
   * @param {string} _cid
   */
  getKey(_cid) {
    return this.mappings[_cid];
  }

  /**
   * Set server id from client - server mapping.
   * @param {object} model
   */
  setKey(model) {
    model._key = this.getKey(model._cid);
  }

  /**
   * Create mapping between client id and server id
   * and store it inside resource cache. Cache is used when
   * model is modified before being created on the server. Using cache
   * module can use key recieved from previous action in order
   * to execute apropriate action.
   * @param {string} _cid
   * @param {string} _key
   */
  map(_cid, _key) {
    this.mappings[_cid] = _key;
    this.mappings[_key] = _cid;
  }

  /*
   * Remove both client and server ids for given model.
   * @param {object} model
   */
  unmap(model) {
    const cid = this.mappings[model._key];
    if (cid) delete this.mappings[cid];
    delete this.mappings[model._key];
  }

  /**
   * Returns copy of model without client metadata.
   * @param {object} model
   */
  clean(model) {
    return omit(model, '_cid', '_version', '_synced');
  }

  /**
   * Creates or updates the model.
   * @param {object} model
   */
  save(model) {
    const url = this.url('');
    return this.queue.add(() => {
      // if server id is not provided but exist inside resource cache
      if (!model._key && this.getKey(model._cid)) this.setKey(model);
      const action = model._key ? 'put' : 'post';
      return axios[action](url, this.clean(model));
    }).then(response => {
      if (!model._key) this.map(model._cid, response.data.data._key);
      return assign(model, response.data.data);
    });
  }

  /**
   * Remove the model.
   * @param {object} model
   */
  remove(model) {
    return this.delete(model._key).then(response => {
      let result = {};
      const data = response.data.data;
      if (isArray(data)) {
        data.forEach(it => {
          result[this.mappings[it._key]] = it;
          this.unmap(it);
        });
      } else {
        result[this.mappings[data._key]] = data;
        this.unmap(data);
      }
      return result;
    });
  }

  /**
   * Retrieve items based on provided params, append client id
   * and transform array into object keyed by client ids.
   * @param {object} params Query params
   */
  fetch(params) {
    return this.get('', params).then(response => {
      let result = {};
      response.data.data.forEach(it => {
        this.setCid(it);
        result[it._cid] = it;
      });
      return result;
    });
  }

  get(path, params = {}) {
    return axios.get(this.url(path), { params });
  }

  head(path, config) {
    return axios.head(this.url(path), config);
  }

  post(path, data, config) {
    return this.queue.add(() => axios.post(this.url(path), data, config));
  }

  put(path, data, config) {
    return this.queue.add(() => axios.put(this.url(path), data, config));
  }

  patch(path, data, config) {
    return this.queue.add(() => axios.patch(this.url(path), data, config));
  }

  delete(path, config) {
    return this.queue.add(() => axios.delete(this.url(path), config));
  }
}
