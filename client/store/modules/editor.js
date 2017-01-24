import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
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
  return find(courses, { _key: route.params.courseKey });
});

getter(function activities() {
  const { route } = this.rootState;
  const { activities: collection } = this.rootGetters;
  return filter(collection, { courseKey: route.params.courseKey });
});

getter(function activity() {
  const { activities } = this.rootGetters;
  return activities[this.state.activity] || {};
});

getter(function assets() {
  const { route } = this.rootState;
  if (route.name !== 'editor') return;
  return this.rootGetters.assets;
});

getter(function users() {
  const { route } = this.rootState;
  const { courseKey } = route.params;
  const course = find(this.rootGetters.courses, { _key: courseKey });
  let result = filter(this.rootGetters.users, it => course.users[it._key]);
  return map(result, it => ({ ...it, role: course.users[it._key] }));
});

mutation(function focusActivity(_cid) {
  this.state.activity = _cid;
});

export default build();
