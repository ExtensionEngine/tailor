import { createMutationTypes } from '../../creators';

export default createMutationTypes('courses', [
  // async
  'FETCH_COURSES_FAILURE',
  'FETCH_COURSES_REQUEST',
  'FETCH_COURSES_SUCCESS',
  'CREATE_COURSE_FAILURE',
  'CREATE_COURSE_REQUEST',
  'CREATE_COURSE_SUCCESS',

  'ADD_COURSES',
  'ADD_COURSE'
]);
