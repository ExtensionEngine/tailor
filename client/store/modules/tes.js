import calculatePosition from 'utils/calculatePosition.js';
import VuexCollection from '../helpers/collection.js';

const { action, build, getter, mutation } = new VuexCollection('tes', '/tes');

getter(function tes() {
  return this.state.items;
}, { global: true });

action(function insert({ element, context }) {
  const position = calculatePosition(context);
  return this.context.dispatch('tes/save', { ...element, position });
});

action(function reorder({ element, context }) {
  this.commit('reorder', { element, position: calculatePosition(context) });
  const data = { position: context.newPosition };
  return this.api.post(`${element.id}/reorder`, data)
    .then(res => {
      let element = res.data.data;
      this.api.setCid(element);
      this.commit('save', element);
    });
});

mutation(function reorder({ element, position }) {
  element.position = position;
});

export default build();
