const getCourses = state => state.courses;
const getMessage = state => state.fetchCourses.message;

export default {
  getCourses,
  getMessage
};
