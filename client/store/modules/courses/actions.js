import courseMutations from './mutation-types';
import coursesApi from '../../../api/courses';

function fetchCourses({ dispatch, commit }) {
  commit(courseMutations.FETCH_COURSES_REQUEST);
  coursesApi.get()
    .then(resp => {
      commit(courseMutations.FETCH_COURSES_SUCCESS);
      commit(courseMutations.ADD_COURSES, resp.courses);
    })
    .catch(error => {
      commit(courseMutations.FETCH_COURSES_FAILURE, error);
    });
}

export default {
  fetchCourses
};
