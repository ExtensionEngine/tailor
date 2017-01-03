import { VuexModule } from 'vuex-module';

const { build, getter, mutation, state } = new VuexModule('editor');
const EDITOR_ROUTES = ['course', 'editor'];

state({
  activity: undefined
});

getter(function course() {
  const { route } = this.rootState;
  const { courses } = this.rootGetters;
  if (EDITOR_ROUTES.indexOf(route.name) < 0) return;
  return courses[route.params.courseKey];
});

getter(function activity() {
  const { activities } = this.rootGetters;
  return activities[this.state.activity] || {};
});

mutation(function focusActivity(_cid) {
  this.state.activity = _cid;
});

export default build();
