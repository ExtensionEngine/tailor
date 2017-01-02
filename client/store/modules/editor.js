import { VuexModule } from 'vuex-module';

const { build, getter, state } = new VuexModule('editor');
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

export default build();
