import axios from 'axios';
import { urlBuilder, headerBuilder } from './helpers';

// TODO(marko): add other rest methods
class BaseAPI {
  constructor(basePath = '', headers = {}) {
    this.baseUrl = urlBuilder(basePath);
    this.headers = headerBuilder(headers);

    this.list = this.list.bind(this);
    this.show = this.show.bind(this);
    this.create = this.create.bind(this);
  }

  list(path = [], query = {}) {
    const url = this.baseUrl(path, query);
    return axios.get(url, this.headers);
  }

  show(path = [], query = {}) {
    const url = this.baseUrl(path, query);
    return axios.get(url, this.headers);
  }

  create(data = {}, path = [], query = {}) {
    const url = this.baseUrl(path, query);
    return axios.post(url, data, this.headers);
  }
};

export default BaseAPI;
