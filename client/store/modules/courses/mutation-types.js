import { createMutationTypes } from '../../creators';

export default createMutationTypes('courses', [
  // async
  'FETCH_COURSES_FAILURE',
  'FETCH_COURSES_REQUEST',
  'FETCH_COURSES_SUCCESS',

  'ADD_COURSES'
]);
