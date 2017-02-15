import { VuexModule } from 'vuex-module';

const { state, getter, mutation, build } = new VuexModule();

const types = { VIDEO: 'VIDEO', GOMO: 'GOMO', TEXT: 'TEXT' };
function getType(itemType) {
  if (!itemType) return '';
  return types[itemType] || types.TEXT;
}

state({ toolbar: { type: '', context: {} } });

getter(function toolbar() {
  return this.state.toolbar;
});

mutation(function setToolbarContext(context = {}) {
  this.state.toolbar.type = getType(context.type);
  this.state.toolbar.context = context;
});

export default build();
