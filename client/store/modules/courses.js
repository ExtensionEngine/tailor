import VuexModel from '../helpers/model.js';
import config from '../../../config/server';
const { api, state, getter, action, mutation, build } = new VuexModel('courses', '/courses');

state({
  search: '',
  $internals: {
    pagination: {
      limit: 9,
      page: 1,
      pages: 1
    },
    sort: {
      order: config.params.sort.order.DESC,
      field: config.params.sort.field
    }
  }
});

getter(function courses() {
  return this.state.items;
}, { global: true });

getter(function params() {
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

getter(function moreResults() {
  const { page, pages } = this.state.$internals.pagination;
  return page < pages;
});

action(function fetch(nextPage = false) {
  return api.get('', this.getters.params).then(response => {
    let result = {};
    const { docs, page, pages } = response.data.data;

    docs.forEach(it => {
      this.api.setCid(it);
      result[it._cid] = it;
    });

    this.commit('setPagination', { page, pages });
    if (nextPage) this.commit('fetchNextPage', result);
    else this.commit('fetch', result);
  });
});

mutation(function fetchNextPage(courses) {
  const items = {};

  Object.keys(this.state.items).forEach(key => {
    items[key] = this.state.items[key];
  });
  Object.keys(courses).forEach(key => {
    items[key] = courses[key];
  });

  this.state.items = items;
});

mutation(function setPagination(params) {
  const { page, pages } = params;
  const pagination = this.state.$internals.pagination;

  this.state.$internals.pagination = { ...pagination, page, pages };
});

mutation(function setPage() {
  const { page, pages } = this.state.$internals.pagination;
  this.state.$internals.pagination.page = page < pages ? page + 1 : page;
});

mutation(function setSearch(search) {
  this.state.search = search;
});

export default build();
