import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import Auth from './components/auth/Container';
import Course from './components/course/Container';
import Catalog from './components/catalog/Container';
import CourseEditor from './components/editor/Container';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: Catalog,
      meta: { auth: true }
    },
    {
      path: '/course/:id',
      name: 'course',
      component: Course,
      meta: { auth: true }
    },
    {
      path: '/editor/:activityId',
      name: 'course-editor',
      component: CourseEditor,
      meta: { auth: true }
    },
    {
      path: '/',
      name: 'auth',
      component: Auth,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: ResetPassword
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(it => it.meta.auth) && !store.getters.user) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
