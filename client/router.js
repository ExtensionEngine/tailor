/* eslint-disable sort-imports */
import { numeric as numericParser } from 'client/utils/paramsParser';
import Router from 'vue-router';
import store from './store';
import Vue from 'vue';

import Auth from './components/auth/Container';
import Catalog from './components/catalog/Container';
import Course from './components/course';
import CourseRevisions from './components/course/Revisions';
import CourseSettings from './components/course/Settings';
import CourseUserManagement from './components/course/Settings/CourseUserManagement';
import Editor from './components/editor';
import ForgotPassword from './components/auth/ForgotPassword';
import General from './components/course/Settings/General';
import Login from './components/auth/Login';
import Outline from './components/course/Outline';
import ResetPassword from './components/auth/ResetPassword';
import SystemElementsList from './components/system-settings/ElementsList';
import SystemSchemasList from './components/system-settings/SchemasList';
import SystemSettings from './components/system-settings';
import SystemUserManagement from './components/system-settings/UserManagement';
import TreeView from './components/course/TreeView';

Vue.use(Router);

let router = new Router({
  routes: [{
    path: '/',
    name: 'catalog',
    component: Catalog,
    meta: { auth: true }
  }, {
    path: '/course/:courseId',
    component: Course,
    props: numericParser,
    meta: { auth: true },
    children: [{
      path: '',
      name: 'course',
      component: Outline
    }, {
      path: 'editor/:activityId',
      name: 'editor',
      component: Editor
    }, {
      path: 'settings',
      component: CourseSettings,
      children: [{
        path: '',
        name: 'course-info',
        component: General
      }, {
        path: 'users',
        name: 'user-management',
        props: numericParser,
        component: CourseUserManagement
      }]
    }, {
      path: 'revisions',
      name: 'course-revisions',
      component: CourseRevisions
    }, {
      path: 'tree-view',
      name: 'tree-view',
      component: TreeView
    }]
  }, {
    path: '/system-settings',
    component: SystemSettings,
    meta: { auth: true },
    children: [{
      path: '/',
      name: 'system-management',
      redirect: { name: 'system-user-management' }
    }, {
      path: 'users',
      name: 'system-user-management',
      component: SystemUserManagement
    }, {
      path: 'schemas',
      name: 'system-schemas-list',
      component: SystemSchemasList
    }, {
      path: 'elements',
      name: 'system-elements-list',
      component: SystemElementsList
    }]
  }, {
    path: '/',
    name: 'auth',
    component: Auth,
    children: [{
      path: 'login',
      name: 'login',
      component: Login
    }, {
      path: 'forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
    }, {
      path: 'reset-password/:token',
      name: 'reset-password',
      component: ResetPassword
    }]
  }]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(it => it.meta.auth) && !store.getters.user) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
