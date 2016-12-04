const getCourse = state => state.course;
const getCourses = state => state.courses;
const getCreateStatus = state => state.createCourse;
const getCourseFetchStatus = state => state.fetchCourse;
const getCoursesFetchStatus = state => state.fetchCourses;

export default {
  getCourse,
  getCourses,
  getCreateStatus,
  getCourseFetchStatus,
  getCoursesFetchStatus
};
