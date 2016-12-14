import Vue from 'vue';
import Router from 'vue-router';

import Auth from './components/auth/Container';
import Course from './components/course/Container';
import CourseDetails from './components/course/Details';
import CourseSettings from './components/course/Settings';
import Catalog from './components/catalog/Container';
import CourseEditor from './components/editor/Container';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';

Vue.use(Router);

// TODO: Implement auth based route checking
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: Catalog
    },
    {
      path: '/catalog/:courseId',
      name: 'course-editor',
      component: CourseEditor
    },
    {
      path: '/course/:id',
      name: 'course',
      component: Course,
      children: [
        {
          path: '',
          name: 'course-details',
          component: CourseDetails
        },
        {
          path: 'settings',
          name: 'course-settings',
          component: CourseSettings
        }
      ]
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
