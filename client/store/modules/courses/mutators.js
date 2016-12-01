import courseMutations from './mutation-types';
import { asyncState } from '../../../utils/async';

const state = {
  courses: [],
  fetchCourses: {
    ...asyncState.REQUEST,
    message: null
  }
};

const mutations = {
  [courseMutations.ADD_COURSES](state, courses) {
    console.log('mutators: ', courses);
    state.courses = courses;
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
  }
};

export { mutations, state };
