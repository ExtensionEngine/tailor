import enhanceError from 'axios/lib/core/enhanceError';

// NOTE: added `JSendError` handler for later `jsend` implementation
class JSendError extends Error {
  constructor(message, response) {
    super(message);
    const { config, request, jsend } = response;
    const { toJSON, ...info } = enhanceError({}, config, null, request, response);
    Object.assign(this, info, {
      jsend,
      toJSON() {
        const json = toJSON.call(this);
        return Object.assign(json, { jsend });
      }
    });
  }

  get name() {
    return this.constructor.name;
  }

  get isJSendError() {
    return true;
  }
}

export default JSendError;
