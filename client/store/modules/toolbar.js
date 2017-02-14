import { VuexModule } from 'vuex-module';

const { state, getter, mutation, build } = new VuexModule();

function getType(itemType) {
  if (!itemType) return '';
  else if (itemType === 'VIDEO') return 'VIDEO';
  else if (itemType === 'GOMO') return 'GOMO';
  else return 'TEXT';
}

state({ toolbar: { type: '', context: {} } });

getter(function toolbar() {
  return this.state.toolbar;
});

// rename
mutation(function setToolbar(context = {}) {
  this.state.toolbar.type = getType(context.type);
  this.state.toolbar.context = context;
});

export default build();
