import { client, extractData } from '@tailor/api';
import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import join from 'url-join';
import omit from 'lodash/omit';
import Queue from 'promise-queue';
import reduce from 'lodash/reduce';
import uuid from '@/utils/uuid';

// Used to serialize api calls that modify data.
const queue = new Queue(1, Infinity);

export default class Resource {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = queue;
    this.mappings = {};
  }

  url(path = '') {
    return join(this.baseUrl, path.toString());
  }

  /**
   * Returns copy of model without client metadata.
   * @param {object} model
   */
  clean(model) {
    return omit(model, '_version', '_synced');
  }

  /**
   * Transform BE collection into store format.
   * @param {Array} items
   */
  processEntries(items) {
    return reduce(items, (acc, it) => {
      acc[it.uid] = it;
      this.map(it.uid, it.id);
      return acc;
    }, {});
  }

  /**
   * Create mapping between uid and id
   * and store it inside resource cache. Cache is used when
   * model is modified before being created on the server. Using cache
   * module can use key recieved from previous action in order
   * to execute apropriate action.
   * @param {string} uid
   * @param {number} id
   */
  map(uid, id) {
    this.mappings[uid] = id;
    this.mappings[id] = uid;
  }

  /**
   * Retrieves model by id.
   */
  getById(id) {
    return this.get(id)
      .then(extractData)
      .then(item => this.processEntries([item]) && item);
  }

  /**
   * Creates a new model, or replaces an existing one.
   * @param {object} model
   */
  save(model) {
    return this.queue.add(() => {
      if (!model.uid) model.uid = uuid();
      const action = model.id ? 'patch' : 'post';
      return client[action](this.url(model.id), this.clean(model))
        .then(extractData)
        .then(data => {
          if (!model.id) this.map(model.uid, data.id);
          return assign(cloneDeep(model), data);
        });
    });
  }

  /**
   * Partially updates an existing model.
   * @param {string} uid - uid of the model to update.
   * @param {object} changes - Key-value collection of properties to update.
   */
  update(uid, changes) {
    const id = changes.id || this.mappings[uid];
    return this.patch(id, changes).then(extractData);
  }

  /**
   * Remove the model.
   * @param {object} model
   */
  remove(model) {
    return this.delete(model.id).then(() => [model]);
  }

  /**
   * Retrieve items based on provided params.
   * Transform array into object keyed by uid.
   * @param {object} params Query params
   */
  fetch(params) {
    return this.get('', params)
      .then(extractData)
      .then(data => this.processEntries(data));
  }

  get(path, params = {}) {
    return client.get(this.url(path), { params });
  }

  head(path, config) {
    return client.head(this.url(path), config);
  }

  post(path, data, config) {
    return this.queue.add(() => client.post(this.url(path), data, config));
  }

  put(path, data, config) {
    return this.queue.add(() => client.put(this.url(path), data, config));
  }

  patch(path, data, config) {
    return this.queue.add(() => client.patch(this.url(path), data, config));
  }

  delete(path, config) {
    return this.queue.add(() => client.delete(this.url(path), config));
  }
}
