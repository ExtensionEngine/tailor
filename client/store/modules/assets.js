import VuexCollection from '../helpers/collection.js';
import calculatePosition from '../../utils/calculatePosition.js';

const { action, getter, mutation, build } = new VuexCollection('assets', '/assets');

getter(function assets() {
  return this.state.items;
}, { global: true });

action(function reorder({ asset, context }) {
  this.commit('reorder', { asset, position: calculatePosition(context) });
  const data = { position: context.newPosition };
  return this.api.post(`${asset.id}/reorder`, data)
    .then(res => {
      let asset = res.data.data;
      this.api.setCid(asset);
      this.commit('save', asset);
    });
});

mutation(function reorder({ asset, position }) {
  asset.position = position;
});

export default build();
