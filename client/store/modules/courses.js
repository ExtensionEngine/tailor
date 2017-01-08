import VuexModel from '../helpers/model.js';
import cuid from 'cuid';
const { state, getter, action, mutation, build } = new VuexModel('courses', '/courses');

state({
  search: ''
});

getter(function courses() {
  return this.state.items;
}, { global: true });

action(function fetchNextPage() {
  this.api.fetch()
    .then(courses => {
      const stateItemCount = Object.keys(this.state.items).length;
      let newItems = [];

      // Generate dummy values
      for (let i = stateItemCount + 1; i < stateItemCount + 10; i++) {
        newItems.push({
          _cid: cuid(),
          name: `Test name ${i}`,
          description: 'Test description'
        });
      }

      this.commit('fetchNextPage', newItems);
    });
});

mutation(function fetchNextPage(courses) {
  let stateItems = [];
  let items = {};

  // Convert state items to array
  for (let key in this.state.items) {
    stateItems.push(this.state.items[key]);
  }

  // Concat and convert back to object
  stateItems.concat(courses).forEach(
    item => {
      items[item._cid] = item;
    }
  );

  this.state.items = items;
});

mutation(function setSearch(search) {
  this.state.search = search;
});

export default build();
