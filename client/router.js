/* eslint-disable sort-imports */
import { numeric as numericParser } from 'client/utils/paramsParser';
import Router from 'vue-router';
import { role } from '@/../config/shared';
import store from './store';
import Vue from 'vue';

import Auth from './components/auth/Container';
import Catalog from './components/catalog/Container';
import Course from './components/course';
import CourseRevisions from './components/course/Revisions';
import CourseSettings from './components/course/Settings';
import Editor from './components/editor';
import ForgotPassword from './components/auth/ForgotPassword';
import General from './components/course/Settings/General';
import InstalledElements from './components/system-settings/ContentElements';
import InstalledSchemas from './components/system-settings/StructureTypes';
import Login from './components/auth/Login';
import Outline from './components/course/Outline';
import RepoUserManagement from './components/course/Settings/UserManagement';
import ResetPassword from './components/auth/ResetPassword';
import SystemSettings from './components/system-settings';
import SystemUserManagement from './components/system-settings/UserManagement';
import TreeView from './components/course/TreeView';
import UserSettings from './components/user-settings';

Vue.use(Router);

const router = new Router({
  routes: [{
    path: '/',
    name: 'catalog',
    component: Catalog,
    meta: { auth: true }
  }, {
    path: '/settings',
    name: 'user-settings',
    component: UserSettings,
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
        component: RepoUserManagement
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
    path: '/course/:courseId/editor/:activityId',
    name: 'editor',
    component: Editor,
    meta: { auth: true }
  }, {
    path: '/system-settings',
    component: SystemSettings,
    meta: { auth: true, allowed: [role.user.ADMIN] },
    children: [{
      path: '/',
      name: 'system-management',
      redirect: { name: 'system-user-management' }
    }, {
      path: 'users',
      name: 'system-user-management',
      component: SystemUserManagement
    }, {
      path: 'installed-schemas',
      name: 'installed-schemas',
      component: InstalledSchemas
    }, {
      path: 'installed-elements',
      name: 'installed-elements',
      component: InstalledElements
    }, {
      path: '*',
      redirect: { name: 'system-management' }
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
  if (to.matched.some(it => it.meta.auth) && !store.state.auth.user) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else if (!isAllowed(to)) {
    next({ path: from.fullPath });
  } else {
    next();
  }
});

export default router;

function isAllowed(route) {
  const { meta = {} } = route.matched.find(({ meta = {} }) => meta.allowed) || {};
  return !meta.allowed || meta.allowed.includes(store.state.auth.user.role);
}
