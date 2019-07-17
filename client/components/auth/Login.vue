<template>
  <div>
    <div class="message">
      <span v-if="message">{{ message }}</span>
    </div>
    <form @submit.prevent="submit" novalidate>
      <div class="form-group">
        <v-text-field
          v-validate="{ required: true, email: true }"
          v-model="email"
          :error-messages="vErrors.collect('email')"
          type="email"
          name="email"
          label="Email"/>
      </div>
      <div class="form-group">
        <v-text-field
          v-validate="{ required: true }"
          v-model="password"
          :error-messages="vErrors.collect('password')"
          type="password"
          name="password"
          label="Password"/>
      </div>
      <v-btn :disabled="!isValid" color="primary" outline block type="submit">
        Log in
      </v-btn>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">
          Forgot password ?
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { withValidation } from 'utils/validation';
const LOGIN_ERR_MESSAGE = 'User email and password do not match';

export default {
  name: 'login',
  mixins: [withValidation()],
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
  computed: {
    ...mapState({ user: state => state.auth.user }),
    isValid() {
      return this.email && this.password && this.vErrors.count() === 0;
    }
  },
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
  padding: 15px 0 5px;
  text-align: right;
}
</style>
