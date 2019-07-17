<template>
  <div>
    <div class="message">
      <span v-if="message">{{ message }}</span>
    </div>
    <form @submit.prevent="submit" novalidate>
      <div class="form-group">
        <v-text-field v-model="email" type="email" label="Email"/>
      </div>
      <div class="form-group">
        <v-text-field v-model="password" type="password" label="Password"/>
      </div>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">
          Forgot password ?
        </router-link>
      </div>
      <v-btn color="primary" outline block type="submit">Log in</v-btn>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
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
  computed: mapState({ user: state => state.auth.user }),
  methods: {
    ...mapActions(['login']),
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
  padding: 10px 0 25px;
  text-align: right;
}
</style>
