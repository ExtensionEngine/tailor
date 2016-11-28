import Vue from 'vue';
import Router from 'vue-router';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/reset-password', component: ResetPasswordPage }
  ]
});
