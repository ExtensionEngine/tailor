import { VuexModule } from 'vuex-module';
const { state, action, mutation, build } = new VuexModule('activities');

state([
  { _key: 'k1', order: 1, name: 'Introduction' },
  { _key: 'k2', order: 2, name: 'Values, Types, and Operators' },
  { _key: 'k3', order: 3, name: 'Program Structure' },
  { _key: 'k4', order: 4, name: 'Functions' },
  { _key: 'k5', order: 5, name: 'Data Structures: Objects and Arrays' },
  { _key: 'k10', parentKey: 'k4', order: 1, name: 'Defining a function' },
  { _key: 'k11', parentKey: 'k4', order: 2, name: 'Parameters and scopes' },
  { _key: 'k12', parentKey: 'k4', order: 3, name: 'Nested scope' },
  { _key: 'k13', parentKey: 'k5', order: 1, name: 'Data sets' },
  { _key: 'k14', parentKey: 'k5', order: 2, name: 'Properties' }
]);

action(function create(item) {
  let reorder = { from: 1000, to: item.order, parentKey: item.parentKey };
  item.order = 1000;
  this.commit('create', item);
  this.commit('reorder', reorder);
});

action(function reorder(payload) {
  this.commit('reorder', payload);
});

mutation(function create(activity) {
  this.state.push(activity);
});

mutation(function reorder({ from, to, parentKey }) {
  const step = from > to ? 1 : -1;
  this.state.forEach(it => {
    if (it.parentKey !== parentKey) return;
    if (it.order === from) {
      it.order = to;
    } else if (
      (it.order > from && it.order <= to) ||
      (it.order < from && it.order >= to)) {
      it.order += step;
    }
  });
});

export default build();
