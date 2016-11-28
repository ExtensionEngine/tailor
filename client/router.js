import Vue from 'vue';
import Router from 'vue-router';

import Home from './containers/Home';
import Login from './containers/Login';
import Register from './containers/Register';
import ResetPassword from './containers/ResetPassword';

Vue.use(Router);

// TODO: Implement auth based route checking
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: ResetPassword
    }
  ]
});
