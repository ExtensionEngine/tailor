import { createMutationTypes } from '../creators';

// TODO: Type placeholders, replace with necessary types
export default createMutationTypes('auth', [
  'ADD_TOKEN',

  // async
  'LOGIN_FAILURE',
  'LOGIN_REQUEST',
  'LOGIN_SUCCESS'
]);
