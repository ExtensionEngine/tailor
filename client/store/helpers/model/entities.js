import { VuexModule } from 'vuex-module';
const { state, mutation, build } = new VuexModule('entities');

state({
  $internals: {
    transactions: [],
    subscriptions: {},
    mappings: {}
  }
});

mutation(function map({ _key, _cid }) {
  this.state.$internals.mappings[_cid] = _key;
});

mutation(function startTransaction(transaction) {
  let internals = this.state.$internals;
  internals.transactions.push(transaction);
});

mutation(function commitTransaction() {
  let internals = this.state.$internals;
  internals.transactions.shift();
});

export default build();
