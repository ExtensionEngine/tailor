import courseMutations from './mutation-types';
import { asyncState } from '../../../utils/async';

const state = {
  course: null,
  courses: [],
  createCourse: {
    ...asyncState.INITIAL,
    message: null
  },
  fetchCourses: {
    ...asyncState.INITIAL,
    message: null
  },
  fetchCourse: {
    ...asyncState.INITIAL,
    message: null
  },
  filters: {
    search: ''
  }
};

const mutations = {
  [courseMutations.ADD_COURSE](state, course) {
    state.course = course;
  },

  [courseMutations.REMOVE_COURSE](state) {
    state.course = null;
  },

  [courseMutations.ADD_COURSES](state, courses) {
    state.courses = courses;
  },

  [courseMutations.CREATE_COURSE](state, course) {
    state.courses.push(course);
  },

  [courseMutations.SET_SEARCH_FILTER](state, search) {
    state.filters.search = search;
  },

  [courseMutations.FETCH_COURSE_FAILURE](state, { message }) {
    state.fetchCourse = Object.assign(state.fetchCourse, {
      ...asyncState.FAILURE,
      message
    });
  },

  [courseMutations.FETCH_COURSE_REQUEST](state) {
    state.fetchCourse = Object.assign(state.fetchCourse, {
      ...asyncState.REQUEST,
      message: null
    });
  },

  [courseMutations.FETCH_COURSE_SUCCESS](state) {
    state.fetchCourse = Object.assign(state.fetchCourse, {
      ...asyncState.SUCCESS,
      message: null
    });
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
