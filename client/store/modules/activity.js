import VuexModel from '../helpers/model.js';
const { state, getter, build } = new VuexModel(
  'activity',
  '/courses/885350/activities' // hardcode the URL for now
);

state({
  items: {}
});

getter(function activities() {
  return this.state.items;
}, { global: true });

export default build();
