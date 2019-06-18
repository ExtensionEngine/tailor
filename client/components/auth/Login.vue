<template>
  <div>
    <div class="message">
      <span v-if="message">{{ message }}</span>
    </div>
    <form @submit.prevent="submit" novalidate>
      <div class="form-group">
        <input
          v-model="email"
          class="form-control"
          type="email"
          placeholder="Email"/>
      </div>
      <div class="form-group">
        <input
          v-model="password"
          class="form-control"
          type="password"
          placeholder="Password"/>
      </div>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">
          Forgot password ?
        </router-link>
      </div>
      <button type="submit" class="btn btn-default btn-material btn-block">
        Log in
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
const LOGIN_ERR_MESSAGE = 'User email and password do not match';

export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
  computed: mapGetters('auth', ['user']),
  methods: {
    ...mapActions('auth', ['login']),
    submit() {
      this.message = '';
      this.login({ email: this.email, password: this.password })
        .then(() => this.$router.push('/'))
        .catch(() => (this.message = LOGIN_ERR_MESSAGE));
    }
  }
};
</script>

<style lang="scss" scoped>
.options {
  padding: 5px 0 10px;
  text-align: right;
}
</style>
