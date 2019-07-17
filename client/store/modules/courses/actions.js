import find from 'lodash/find';
import forEach from 'lodash/forEach';
import generateActions from '../../helpers/actions';
import getVal from 'lodash/get';

const {
  api,
  get,
  remove,
  reset,
  setEndpoint,
  update
} = generateActions('/courses');

const save = ({ commit, dispatch }, model) => {
  return api.post('/', model).then(() => {
    commit('setOrder', { field: 'createdAt', order: 'DESC' });
    dispatch('reset');
  });
};

const fetch = ({ getters, commit }, { reset = false } = {}) => {
  const mutation = reset ? 'reset' : 'fetch';
  const params = getters.courseQueryParams;
  return fetchCourses(params).then(courses => {
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

const pin = ({ commit, getters }, { id, pin }) => {
  return api.post(`/${id}/pin`, { pin }).then(({ data: { data } }) => {
    commit('save', { ...find(getters.courses, { id }), courseUser: data });
  });
};

export {
  clone,
  fetch,
  get,
  pin,
  remove,
  reset,
  save,
  setEndpoint,
  update
};

function fetchCourses(params) {
  return api.fetch(params).then(courses => {
    forEach(courses, it => {
      it.courseUser = getVal(it, 'courseUsers.0');
      it.lastChange = it.revisions[0];
    });
    return courses;
  });
}
