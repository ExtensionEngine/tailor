const getCourse = state => state.course;
const getCreateStatus = state => state.createCourse;
const getCourseFetchStatus = state => state.fetchCourse;
const getCoursesFetchStatus = state => state.fetchCourses;
const getFilters = state => state.filters;

const getCourses = state => {
  const { courses, filters } = state;
  const pattern = new RegExp(filters.search, 'i');

  const filtered = courses.filter(c => pattern.test(c.title));
  const sorted = filtered.sort((prev, curr) => {
    const prevDate = new Date(JSON.parse(prev.recentActivity));
    const currDate = new Date(JSON.parse(curr.recentActivity));

    return currDate.getTime() - prevDate.getTime();
  });

  return sorted;
};

export default {
  getCourse,
  getCourses,
  getCreateStatus,
  getCourseFetchStatus,
  getCoursesFetchStatus,
  getFilters
};
