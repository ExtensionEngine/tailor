import axios from 'axios';
import Queue from 'promise-queue';

// used to serialize api calls that modify data
// create, update and delete
const queue = new Queue(1, Infinity);

export default class Resource {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = queue;
  }

  url(path) {
    return `${this.baseUrl}/${path}`;
  }

  save(path, model) {
    const url = this.url(path);
    return this.queue(() => {
      return model._key ? axios.put(url, model) : axios.post(url, model);
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
