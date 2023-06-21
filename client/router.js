/* eslint-disable sort-imports */
import { numeric as numericParser } from 'client/utils/paramsParser';
import Router from 'vue-router';
import { role } from '@/../config/shared';
import Vue from 'vue';

import Auth from './components/auth/Container.vue';
import Catalog from './components/catalog/Container.vue';
import Repository from './components/repository/index.vue';
import RepositoryRevisions from './components/repository/Revisions/index.vue';
import RepositorySettings from './components/repository/Settings/index.vue';
import Editor from './components/editor/index.vue';
import ForgotPassword from './components/auth/ForgotPassword.vue';
import General from './components/repository/Settings/General.vue';
import InstalledElements from './components/system-settings/ContentElements.vue';
import InstalledSchemas from './components/system-settings/StructureTypes.vue';
import Login from './components/auth/Login.vue';
import Outline from './components/repository/Outline/index.vue';
import RepoUserManagement from './components/repository/Settings/UserManagement/index.vue';
import ResetPassword from './components/auth/ResetPassword.vue';
import SystemSettings from './components/system-settings/index.vue';
import SystemUserManagement from './components/system-settings/UserManagement/index.vue';
import UserSettings from './components/user-settings/index.vue';
import Workflow from './components/repository/Workflow/index.vue';

Vue.use(Router);

const options = {
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
    path: '/repository/:repositoryId',
    component: Repository,
    props: numericParser,
    meta: { auth: true },
    children: [{
      path: '',
      name: 'repository',
      component: Outline
    }, {
      path: 'settings',
      component: RepositorySettings,
      children: [{
        path: '',
        name: 'repository-info',
        component: General
      }, {
        path: 'users',
        name: 'user-management',
        props: numericParser,
        component: RepoUserManagement
      }]
    }, {
      path: 'progress',
      name: 'progress',
      component: Workflow
    }, {
      path: 'revisions',
      name: 'revisions',
      component: RepositoryRevisions
    }]
  }, {
    path: '/repository/:repositoryId/editor/:activityId',
    name: 'editor',
    props: numericParser,
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
};

export default function getRouter() {
  const router = new Router(options);
  router.beforeEach((to, from, next) => {
    const { user } = router.app.$store.state.auth;
    if (isAuthRequired(to) && !user) return redirectToLogin(to, next);
    if (to.name === 'login' && user) return next({ path: '/' });
    return isAllowed(to, user) ? next() : next({ path: from.fullPath });
  });
  return router;
}

function redirectToLogin(route, next) {
  const query = { redirect: route.fullPath };
  return next({ path: '/login', query });
}

function isAuthRequired(route) {
  return route.matched.some(it => it.meta.auth);
}

function isAllowed(route, user) {
  const { meta = {} } = route.matched.find(({ meta = {} }) => meta.allowed) || {};
  return !meta.allowed || meta.allowed.includes(user.role);
}
