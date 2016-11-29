import Vue from 'vue';
import Router from 'vue-router';

import Auth from './containers/Auth';
import Home from './containers/Home';
import Login from './components/auth/Login';

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
      path: '/',
      name: 'auth',
      component: Auth,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login
        }
      ]
    }
  ]
});
