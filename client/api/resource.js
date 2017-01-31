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
   * @param {string} id
   */
  getCid(id) {
    return this.mappings[id];
  }

  /**
   * Generate client id for provided model.
   * @param {object} model
   */
  setCid(model) {
    model._cid = this.getCid(model.id) || cuid();
    if (model.id) this.map(model._cid, model.id);
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
    model.id = this.getKey(model._cid);
  }

  /**
   * Create mapping between client id and server id
   * and store it inside resource cache. Cache is used when
   * model is modified before being created on the server. Using cache
   * module can use key recieved from previous action in order
   * to execute apropriate action.
   * @param {string} _cid
   * @param {string} id
   */
  map(_cid, id) {
    this.mappings[_cid] = id;
    this.mappings[id] = _cid;
  }

  /*
   * Remove both client and server ids for given model.
   * @param {object} model
   */
  unmap(model) {
    const cid = this.mappings[model.id];
    if (cid) delete this.mappings[cid];
    delete this.mappings[model.id];
  }

  /**
   * Returns copy of model without client metadata.
   * @param {object} model
   */
  clean(model) {
    return omit(model, '_cid', '_version', '_synced');
  }

  /**
   * Creates a new model, or replaces an existing one.
   * @param {object} model
   */
  save(model) {
    const url = this.url('');
    return this.queue.add(() => {
      // if server id is not provided but exist inside resource cache
      if (!model.id && this.getKey(model._cid)) this.setKey(model);
      const action = model.id ? 'put' : 'post';
      return axios[action](url, this.clean(model));
    }).then(response => {
      if (!model.id) this.map(model._cid, response.data.data.id);
      return assign(model, response.data.data);
    });
  }

  /**
   * Partially updates an existing model.
   * @param {object} cid - Client ID of the model to update.
   * @param {object} changes - Key-value collection of properties to update.
   */
  update(cid, changes) {
    const key = this.getKey(cid);
    return this
      .patch(key, changes)
      .then(response => {
        const updated = response.data.data;
        updated._cid = cid;
        return updated;
      });
  }

  /**
   * Remove the model. In some situations, removing one model causes removal
   * of related resources; result is always an array.
   * @param {object} model
   */
  remove(model) {
    return this.delete(model.id).then(response => {
      const data = response.data.data;
      const result = isArray(data) ? data : [data];
      // Attach cid to server results so that state can be correctly updated
      // using client ids.
      result.forEach(it => {
        it._cid = this.getCid(it.id);
      });

      const unmap = this.unmap.bind(this);
      result.forEach(unmap);
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
