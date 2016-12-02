export const asyncState = {
  INITIAL: { failure: false, request: false, success: false },
  FAILURE: { failure: true, request: false, success: false },
  REQUEST: { failure: false, request: true, success: false },
  SUCCESS: { failure: false, request: false, success: true }
};
