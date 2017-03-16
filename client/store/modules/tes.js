import calculatePosition from 'utils/calculatePosition.js';
import VuexCollection from '../helpers/collection.js';

const { action, build, getter, mutation } = new VuexCollection('tes', '/tes');

getter(function tes() {
  return this.state.items;
}, { global: true });

action(function reorder({ te, context }) {
  this.commit('reorder', { te, position: calculatePosition(context) });
  const data = { position: context.newPosition };
  return this.api.post(`${te.id}/reorder`, data)
    .then(res => {
      let te = res.data.data;
      this.api.setCid(te);
      this.commit('save', te);
    });
});

mutation(function reorder({ te, position }) {
  te.position = position;
});

export default build();
