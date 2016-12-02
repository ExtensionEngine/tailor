import courseMutations from './mutation-types';
import { asyncState } from '../../../utils/async';

const state = {
  courses: [],
  createCourse: {
    ...asyncState.INITIAL,
    message: null
  },
  fetchCourses: {
    ...asyncState.INITIAL,
    message: null
  }
};

const mutations = {
  [courseMutations.ADD_COURSES](state, courses) {
    state.courses = courses;
  },

  [courseMutations.ADD_COURSE](state, course) {
    state.courses.push(course);
  },

  [courseMutations.FETCH_COURSES_FAILURE](state, { message }) {
    state.fetchCourses = Object.assign(state.fetchCourses, {
      ...asyncState.FAILURE,
      message
    });
  },

  [courseMutations.FETCH_COURSES_REQUEST](state) {
    state.fetchCourses = Object.assign(state.fetchCourses, {
      ...asyncState.REQUEST,
      message: null
    });
  },

  [courseMutations.FETCH_COURSES_SUCCESS](state) {
    state.fetchCourses = Object.assign(state.fetchCourses, {
      ...asyncState.SUCCESS,
      message: null
    });
  },

  [courseMutations.CREATE_COURSE_FAILURE](state, { message }) {
    state.createCourse = Object.assign(state.createCourse, {
      ...asyncState.FAILURE,
      message
    });
  },

  [courseMutations.CREATE_COURSE_REQUEST](state) {
    state.createCourse = Object.assign(state.createCourse, {
      ...asyncState.REQUEST,
      message: null
    });
  },

  [courseMutations.CREATE_COURSE_SUCCESS](state) {
    state.createCourse = Object.assign(state.createCourse, {
      ...asyncState.SUCCESS,
      message: null
    });
  },

  [courseMutations.CREATE_COURSE_STATUS_RESET](state) {
    state.createCourse = Object.assign(state.createCourse, {
      ...asyncState.INITIAL,
      message: null
    });
  }
};

export { mutations, state };
