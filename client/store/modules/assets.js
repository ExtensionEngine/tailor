import VuexCollection from '../helpers/collection.js';
import updatePosition from '../../utils/updatePosition.js';

const { action, getter, build } = new VuexCollection('assets', '/assets');

getter(function assets() {
  return this.state.items;
}, { global: true });

action(function reorder({ asset, positionData, newPosition }) {
  asset.position = updatePosition(positionData);
  this.commit('save', asset);
  return this.api.post(`${asset.id}/reorder`, { position: newPosition })
    .then(res => {
      let asset = res.data.data;
      this.api.setCid(asset);
      this.commit('save', asset);
    });
});

export default build();
