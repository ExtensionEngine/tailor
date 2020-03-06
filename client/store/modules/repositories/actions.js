import find from 'lodash/find';
import forEach from 'lodash/forEach';
import generateActions from '@/store/helpers/actions';
import getVal from 'lodash/get';

const {
  api,
  remove,
  reset,
  setEndpoint,
  update
} = generateActions('/repositories');

const fetch = ({ getters, commit }) => {
  const params = getters.repositoryQueryParams;
  const mutation = params.offset === 0 ? 'reset' : 'fetch';
  return api.fetch(params).then(items => {
    forEach(items, processRepository);
    commit(mutation, items);
    commit('setPagination', { offset: params.offset + params.limit });
    commit('allRepositoriesFetched', Object.keys(items).length < params.limit);
  });
};

const get = ({ commit }, id) => {
  return api.getById(id).then(repository => {
    processRepository(repository);
    commit('save', repository);
  });
};

const clone = ({ dispatch }, { id, name, description }) => {
  return api.post(`/${id}/clone`, { name, description }).then(response => {
    const { data: repository } = response.data;
    dispatch('reset');
    return repository.id;
  });
};

const pin = ({ commit, getters }, { id, pin }) => {
  return api.post(`/${id}/pin`, { pin }).then(({ data: { data } }) => {
    commit('save', { ...find(getters.repositories, { id }), repositoryUser: data });
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

function processRepository(it) {
  it.repositoryUser = getVal(it, 'repositoryUsers.0');
  it.lastChange = it.revisions[0];
}
