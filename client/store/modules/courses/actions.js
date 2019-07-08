import generateActions from '../../helpers/actions';

const {
  api,
  get,
  remove,
  reset,
  save,
  setEndpoint,
  update
} = generateActions('/courses');

const fetch = ({ getters, commit }, { reset = false } = {}) => {
  const mutation = reset ? 'reset' : 'fetch';
  const params = getters.courseQueryParams;
  return api.fetch(params).then(courses => {
    commit('setPagination', { offset: params.offset + params.limit });
    commit('allCoursesFetched', Object.keys(courses).length < params.limit);
    commit(mutation, courses);
  });
};

const clone = ({ commit }, { id, name, description }) => {
  return api.post(`/${id}/clone`, { name, description }).then(response => {
    const { data: course } = response.data;
    commit('add', course);
    return course.id;
  });
};

export { clone, fetch, get, remove, reset, save, setEndpoint, update };
