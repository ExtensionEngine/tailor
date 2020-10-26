import types from './types';

class ValidationService {
  validate(condition, message, type = types.WARNING) {
    if (condition) console[type](message);
    return this;
  }
}

export default new ValidationService();
