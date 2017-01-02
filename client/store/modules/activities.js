import each from 'lodash/each';
import Vue from 'vue';
import { VuexModule } from 'vuex-module';

const { state, getter, action, mutation, build } = new VuexModule('activities');

// TODO: Remove mocks
state({
  items: {
    '332ae': { _cid: '332ae', _key: 'k1', type: 'TOPIC', order: 1, name: 'Introduction' },
    '33xcd': { _cid: '33xcd', _key: 'k2', type: 'TOPIC', order: 2, name: 'Values, Types, and Operators' },
    '3xc32': { _cid: '3xc32', _key: 'k3', type: 'TOPIC', order: 3, name: 'Program Structure' },
    '3dd32': { _cid: '3dd32', _key: 'k4', type: 'TOPIC', order: 4, name: 'Functions' },
    'z332g': { _cid: 'z332g', _key: 'k5', type: 'TOPIC', order: 5, name: 'Data Structures: Objects and Arrays' },
    '3wc32': { _cid: '3wc32', _key: 'k10', type: 'LLO', parentKey: '3dd32', order: 1, name: 'Defining a function' },
    '3bv32': { _cid: '3bv32', _key: 'k11', type: 'LLO', parentKey: '3dd32', order: 2, name: 'Parameters and scopes' },
    '33vb2': { _cid: '33vb2', _key: 'k12', type: 'LLO', parentKey: '3dd32', order: 3, name: 'Nested scope' },
    'wn332': { _cid: 'wn332', _key: 'k13', type: 'LLO', parentKey: 'z332g', order: 1, name: 'Data sets' },
    '3vbc2': { _cid: '3vbc2', _key: 'k14', type: 'LLO', parentKey: 'z332g', order: 2, name: 'Properties' },
    '1mbc2': { _cid: '1mbc2', _key: 'k15', type: 'CLO', parentKey: '3vbc2', order: 1, name: 'Test' }
  }
});

getter(function activities() {
  return this.state.items;
}, { global: true });

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
  Vue.set(this.state.items, activity._cid, activity);
});

mutation(function reorder({ from, to, parentKey }) {
  const step = from > to ? 1 : -1;
  each(this.state.items, it => {
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
