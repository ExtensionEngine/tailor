const getCourse = state => state.course;
const getCreateStatus = state => state.createCourse;
const getCourseFetchStatus = state => state.fetchCourse;
const getCoursesFetchStatus = state => state.fetchCourses;
const getFilters = state => state.filters;

const getCourses = state => {
  const { courses, filters } = state;
  const pattern = new RegExp(filters.search, 'i');

  return courses.filter(c => pattern.test(c.title));
};

export default {
  getCourse,
  getCourses,
  getCreateStatus,
  getCourseFetchStatus,
  getCoursesFetchStatus,
  getFilters
};
