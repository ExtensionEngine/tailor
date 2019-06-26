import {
  get,
  remove,
  reset,
  save,
  setBaseUrl,
  update
} from '../../helpers/actions';

const fetch = ({ state, getters, commit }, { reset = false } = {}) => {
  const mutation = reset ? 'reset' : 'fetch';
  const params = getters.courseQueryParams;
  return state.api.get('', params).then(response => {
    const { data: courses } = response.data;

    let result = {};
    courses.forEach(it => {
      state.api.setCid(it);
      result[it._cid] = it;
    });

    commit('setPagination', { offset: params.offset + params.limit });
    commit('allCoursesFetched', courses.length < params.limit);
    commit(mutation, result);
  });
};

const clone = ({ state, commit }, { id, name, description }) => {
  return state.api.post(`/${id}/clone`, { name, description }).then(response => {
    const { data: course } = response.data;
    commit('add', course);
    return course.id;
  });
};

export { get, fetch, clone, reset, save, remove, update, setBaseUrl };
