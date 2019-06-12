import pick from 'lodash/pick';
import request from '../../api/request';
import VuexCollection from '../helpers/collection';

const { state, build, getter, action, mutation } = new VuexCollection('revisions');
const PAGINATION_DEFAULTS = { offset: 0, limit: 25 };

state({
  $internals: {
    pagination: PAGINATION_DEFAULTS,
    allRevisionsFetched: false
  }
});

getter(function revisions() {
  return this.state.items;
}, { global: true });

getter(function revisionQueryParams() {
  const { pagination } = this.state.$internals;
  return pagination;
}, { global: true });

getter(function hasMoreResults() {
  return !this.state.$internals.allRevisionsFetched;
});

action(function fetch() {
  if (!this.getters) return;
  const params = this.getters.revisionQueryParams;
  return this.api.get('', params).then(response => {
    const { data: revisions } = response.data;

    let result = {};
    revisions.forEach(it => {
      this.api.setCid(it);
      result[it._cid] = it;
    });

    this.commit('setPagination', { offset: params.offset + params.limit });
    this.commit('allRevisionsFetched', revisions.length < params.limit);
    this.commit('fetch', result);
  });
});

action(function restore(revision) {
  const { id, courseId } = revision.state;
  const url = `/courses/${courseId}/revisions/${id}/restore`;
  return request.post(url, pick(revision, ['state', 'entity']))
    .then(({ data: { data } }) => this.commit('add', data));
});

action(function resetPagination() {
  this.commit('setPagination', PAGINATION_DEFAULTS);
  this.commit('reset', {});
});

mutation(function setPagination(changes) {
  let $internals = this.state.$internals;
  $internals.pagination = { ...$internals.pagination, ...changes };
});

mutation(function allRevisionsFetched(allFetched) {
  this.state.$internals.allRevisionsFetched = allFetched;
});

export default build();
