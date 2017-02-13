import VuexCollection from '../helpers/collection.js';

const { build, getter } = new VuexCollection('revisions');

getter(function revisions() {
  const { route } = this.rootState;
  const courseId = Number(route.params.courseKey);
  const items = this.state.items;
  return Object.keys(items)
    .filter(cid => items[cid].courseId === courseId)
    .map(cid => ({ ...items[cid], createdAt: new Date(items[cid].createdAt) }))
    .sort((rev1, rev2) => rev2.createdAt - rev1.createdAt);
}, { global: true });

export default build();
