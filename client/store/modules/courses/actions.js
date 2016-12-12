import courseMutations from './mutation-types';
import coursesApi from '../../../api/courses';
import router from '../../../router';

function createCourseStatusReset({ commit }) {
  commit(courseMutations.CREATE_COURSE_STATUS_RESET);
}

function setSearchFilter({ commit }, search) {
  commit(courseMutations.SET_SEARCH_FILTER, search);
}

// Async
function createCourse({ commit }, data) {
  commit(courseMutations.CREATE_COURSE_REQUEST);
  coursesApi.createCourse(data)
    .then(resp => {
      commit(courseMutations.CREATE_COURSE_SUCCESS);
      commit(courseMutations.CREATE_COURSE, resp.course);

      router.push({
        name: 'course-editor',
        params: { courseId: resp.course.id }
      });
    })
    .catch(error => {
      commit(courseMutations.CREATE_COURSE_FAILURE, error);
    });
}

function fetchCourse({ commit }, id) {
  commit(courseMutations.FETCH_COURSE_REQUEST);
  coursesApi.getCourse(id)
    .then(resp => {
      commit(courseMutations.FETCH_COURSE_SUCCESS);
      commit(courseMutations.ADD_COURSE, resp.course);
    })
    .catch(error => {
      commit(courseMutations.FETCH_COURSE_FAILURE, error);
    });
};

function fetchCourses({ commit }) {
  commit(courseMutations.FETCH_COURSES_REQUEST);
  coursesApi.getCourses()
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
  fetchCourse,
  fetchCourses,
  setSearchFilter
};
