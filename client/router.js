/* eslint-disable sort-imports */
import { numeric as numericParser } from 'client/utils/paramsParser';
import request from './api/request';
import Router from 'vue-router';
import { role } from '@/../config/shared';
import Vue from 'vue';

import Auth from './components/auth/Container';
import Catalog from './components/catalog/Container';
import Repository from './components/repository';
import RepositoryRevisions from './components/repository/Revisions';
import RepositorySettings from './components/repository/Settings';
import Editor from './components/editor';
import ForgotPassword from './components/auth/ForgotPassword';
import General from './components/repository/Settings/General';
import InstalledElements from './components/system-settings/ContentElements';
import InstalledSchemas from './components/system-settings/StructureTypes';
import Login from './components/auth/Login';
import Outline from './components/repository/Outline';
import RepoUserManagement from './components/repository/Settings/UserManagement';
import ResetPassword from './components/auth/ResetPassword';
import SystemSettings from './components/system-settings';
import SystemUserManagement from './components/system-settings/UserManagement';
import TreeView from './components/repository/TreeView';
import UserSettings from './components/user-settings';
import WorkflowBoard from './components/repository/WorkflowBoard';

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
      path: 'board',
      name: 'board',
      component: WorkflowBoard
    }, {
      path: 'revisions',
      name: 'revisions',
      component: RepositoryRevisions
    }, {
      path: 'tree-view',
      name: 'tree-view',
      component: TreeView
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
    const auth = router.app?.$store.state.auth;
    if (to.matched.some(it => it.meta.auth) && !auth.user) {
      return next({ path: '/login', query: { redirect: to.fullPath } });
    }
    if (!isAllowed(to, auth)) {
      return next({ path: from.fullPath });
    }
    return next();
  });

  request.auth.on('error', () => {
    const redirect = router.currentRoute.fullPath;
    router.replace({ name: 'login', query: { redirect } }).catch(() => {});
  });
  return router;
}

function isAllowed(route, auth) {
  const { meta = {} } = route.matched.find(({ meta = {} }) => meta.allowed) || {};
  return !meta.allowed || meta.allowed.includes(auth.user.role);
}
