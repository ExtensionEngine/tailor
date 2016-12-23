import axios from 'axios';
import Queue from 'promise-queue';

let api = { queue: new Queue(1, Infinity) };

api.request = function (config) {
  return api.queue.add(() => axios.request(config));
};

api.get = axios.get;

api.delete = function (url, config) {
  return api.queue.add(() => axios.delete(url, config));
};

api.head = function (url, config) {
  return api.queue.add(() => axios.head(url, config));
};

api.post = function (url, data, config) {
  return api.queue.add(() => axios.post(url, data, config));
};

api.put = function (url, data, config) {
  return api.queue.add(() => axios.put(url, data, config));
};

api.patch = function (url, data, config) {
  return api.queue.add(() => axios.patch(url, data, config));
};

export default api;
