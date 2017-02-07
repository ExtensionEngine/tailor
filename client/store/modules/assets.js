import VuexCollection from '../helpers/collection.js';
import updatePosition from '../../utils/reorder.js';

const { action, getter, build } = new VuexCollection('assets', '/assets');

getter(function assets() {
  return this.state.items;
}, { global: true });

action(function reorder({ asset, positionData, index }) {
  asset.position = updatePosition(positionData);
  this.commit('save', asset);
  return this.api.post(`${asset.id}/reorder`, { position: index })
    .then(res => {
      let asset = res.data.data;
      this.api.setCid(asset);
      this.commit('save', asset);
    });
});

export default build();
