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
} = generateActions('/repositories');

const fetch = ({ getters, commit }) => {
  const params = getters.courseQueryParams;
  const mutation = params.offset === 0 ? 'reset' : 'fetch';
  return fetchCourses(params).then(items => {
    commit(mutation, items);
    commit('setPagination', { offset: params.offset + params.limit });
    commit('allCoursesFetched', Object.keys(items).length < params.limit);
  });
};

const clone = ({ dispatch }, { id, name, description }) => {
  return api.post(`/${id}/clone`, { name, description }).then(response => {
    const { data: course } = response.data;
    dispatch('reset');
    return course.id;
  });
};

const pin = ({ commit, getters }, { id, pin }) => {
  return api.post(`/${id}/pin`, { pin }).then(({ data: { data } }) => {
    commit('save', { ...find(getters.courses, { id }), repositoryUser: data });
  });
};

export {
  clone,
  fetch,
  get,
  pin,
  remove,
  reset,
  setEndpoint,
  update
};

function fetchCourses(params) {
  return api.fetch(params).then(courses => {
    forEach(courses, it => {
      it.repositoryUser = getVal(it, 'repositoryUsers.0');
      it.lastChange = it.revisions[0];
    });
    return courses;
  });
}
