import { values } from 'lodash';
import VuexModel from '../helpers/model.js';
const { api, state, getter, action, mutation, build } = new VuexModel('courses', '/courses');

state({
  search: '',
  $internals: {
    pagination: {
      limit: 18,
      page: 1,
      next: null,
      previous: 0
    },
    sort: {
      order: 'DESC',
      field: '_key'
    }
  }
});

getter(function courses() {
  return this.state.items;
}, { global: true });

getter(function courseQueryParams() {
  const { pagination, sort } = this.state.$internals;
  const search = this.state.search;

  return {
    search,
    page: pagination.page,
    limit: pagination.limit,
    sortOrder: sort.order,
    sortBy: sort.field
  };
}, { global: true });

getter(function hasMoreResults() {
  return !!this.state.$internals.pagination.next;
});

action(function fetch(nextPage = false) {
  let queryParams = this.getters.courseQueryParams;
  if (nextPage) queryParams.page = this.state.$internals.pagination.next;

  return api.get('', queryParams).then(response => {
    let result = {};
    const { data, page } = response.data;
    const pagination = { ...page, page: queryParams.page };

    data.forEach(it => {
      this.api.setCid(it);
      result[it._cid] = it;
    });

    this.commit('setPagination', pagination);
    if (nextPage) {
      values(result).forEach(it => {
        this.commit('save', it);
      });
    } else {
      this.commit('fetch', result);
    }
  });
});

mutation(function resetPagination() {
  this.state.$internals.pagination = {
    next: null,
    previous: 0,
    page: 1,
    limit: this.state.$internals.pagination.limit
  };
});

mutation(function setPagination(pagination) {
  this.state.$internals.pagination = {
    ...pagination,
    limit: this.state.$internals.pagination.limit
  };
});

mutation(function setSearch(search) {
  this.state.search = search;
});

export default build();
