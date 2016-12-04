const getCourse = state => state.course;
const getCourses = state => state.courses;
const getCreateStatus = state => state.createCourse;
const getFetchStatus = state => state.fetchCourses;

export default {
  getCourse,
  getCourses,
  getCreateStatus,
  getFetchStatus
};
