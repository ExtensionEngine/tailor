import Vue from 'vue';
import VuexCollection from '../helpers/collection.js';

const { state, getter, action, mutation, build } = new VuexCollection('courses', '/courses');
const PAGINATION_DEFAULTS = { offset: 0, limit: 21 };

state({
  search: '',
  $internals: {
    pagination: PAGINATION_DEFAULTS,
    sort: {
      order: 'DESC',
      field: 'updatedAt'
    },
    allCoursesFetched: false
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
    offset: pagination.offset,
    limit: pagination.limit,
    sortOrder: sort.order,
    sortBy: sort.field
  };
}, { global: true });

getter(function hasMoreResults() {
  return !this.state.$internals.allCoursesFetched;
});

action(function fetch({ reset = false } = {}) {
  const mutation = reset ? 'reset' : 'fetch';
  const params = this.getters.courseQueryParams;
  return this.api.get('', params).then(response => {
    const { data: courses } = response.data;

    let result = {};
    courses.forEach(it => {
      this.api.setCid(it);
      result[it._cid] = it;
    });

    this.commit('setPagination', { offset: params.offset + params.limit });
    this.commit('allCoursesFetched', courses.length < params.limit);
    this.commit(mutation, result);
  });
});

action(function clone({ id, name, description }) {
  return this.api.post(`/${id}/clone`, { name, description }).then(response => {
    const { data: course } = response.data;
    this.commit('add', course);
    return course.id;
  });
});

mutation(function resetPagination() {
  this.state.$internals.pagination = PAGINATION_DEFAULTS;
});

mutation(function save(course) {
  const search = this.state.search.toLowerCase();
  const name = course.name.toLowerCase();
  if (search && !name.includes(search)) return;
  Vue.set(this.state.items, course._cid, course);
});

mutation(function setPagination(changes) {
  let $internals = this.state.$internals;
  $internals.pagination = { ...$internals.pagination, ...changes };
});

mutation(function setSearch(query = '') {
  this.state.$internals.pagination = PAGINATION_DEFAULTS;
  this.state.search = query;
});

mutation(function allCoursesFetched(allFetched) {
  this.state.$internals.allCoursesFetched = allFetched;
});

export default build();
