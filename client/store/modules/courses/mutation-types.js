import { createMutationTypes } from '../../creators';

export default createMutationTypes('courses', [
  // async
  'FETCH_COURSE_FAILURE',
  'FETCH_COURSE_REQUEST',
  'FETCH_COURSE_SUCCESS',
  'FETCH_COURSES_FAILURE',
  'FETCH_COURSES_REQUEST',
  'FETCH_COURSES_SUCCESS',
  'CREATE_COURSE_FAILURE',
  'CREATE_COURSE_REQUEST',
  'CREATE_COURSE_SUCCESS',
  'CREATE_COURSE_STATUS_RESET',

  // store
  'ADD_COURSE',
  'ADD_COURSES',
  'CREATE_COURSE',
  'REMOVE_COURSE',

  // filter
  'SET_SEARCH_FILTER'
]);
