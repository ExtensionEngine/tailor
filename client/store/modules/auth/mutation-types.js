import { createMutationTypes } from '../../creators';

export default createMutationTypes('auth', [
  // async
  'LOGIN_FAILURE',
  'LOGIN_REQUEST',
  'LOGIN_SUCCESS'
]);
