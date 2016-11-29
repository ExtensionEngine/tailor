import { createMutationTypes } from '../../creators';

export default createMutationTypes('auth', [
  // async
  'LOGIN_FAILURE',
  'LOGIN_REQUEST',
  'LOGIN_SUCCESS',
  'RESET_PASSWORD_FAILURE',
  'RESET_PASSWORD_REQUEST',
  'RESET_PASSWORD_SUCCESS'
]);
