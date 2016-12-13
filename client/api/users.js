import BaseApi from './base.api';

class UserAPI extends BaseApi {
  constructor(basePath = 'users') {
    super(basePath);
  }
}

export default new UserAPI();
