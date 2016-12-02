import courseMutations from './mutation-types';
import coursesApi from '../../../api/courses';
import router from '../../../router';

function createCourseStatusReset({ commit }) {
  commit(courseMutations.CREATE_COURSE_STATUS_RESET);
}

// Async
function createCourse({ commit }, data) {
  commit(courseMutations.CREATE_COURSE_REQUEST);
  coursesApi.create(data)
    .then(resp => {
      commit(courseMutations.CREATE_COURSE_SUCCESS);
      commit(courseMutations.ADD_COURSE, resp.course);

      router.push({
        name: 'course-editor',
        params: { courseId: resp.course.id }
      });
    })
    .catch(error => {
      commit(courseMutations.CREATE_COURSE_FAILURE, error);
    });
}

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
  createCourseStatusReset,
  createCourse,
  fetchCourses
};
