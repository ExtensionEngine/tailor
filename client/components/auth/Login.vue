<template>
  <div>
    <v-alert
      :value="!!message"
      color="grey darken-3"
      transition="fade-transition"
      dismissible text dense
      class="mb-7 text-left">
      {{ message }}
    </v-alert>
    <form @submit.prevent="submit" novalidate>
      <v-text-field
        v-model="email"
        v-validate="{ required: true, email: true }"
        :error-messages="vErrors.collect('email')"
        type="email"
        name="email"
        label="Email"
        placeholder="Email"
        autocomplete="username"
        prepend-inner-icon="mdi-email-outline"
        outlined
        class="mb-1" />
      <v-text-field
        v-model="password"
        v-validate="{ required: true }"
        :error-messages="vErrors.collect('password')"
        type="password"
        name="password"
        label="Password"
        placeholder="Password"
        prepend-inner-icon="mdi-lock-outline"
        autocomplete="current-password"
        outlined />
      <div class="d-flex">
        <v-spacer />
        <v-btn :disabled="!isValid" type="submit" color="primary darken-1">
          Log in
        </v-btn>
      </div>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">
          Forgot password ?
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { withValidation } from 'utils/validation';
const LOGIN_ERR_MESSAGE = 'The email or password you entered is incorrect.';

export default {
  name: 'user-login',
  mixins: [withValidation()],
  data: () => ({
    email: '',
    password: '',
    message: ''
  }),
  computed: {
    isValid: vm => vm.email && vm.password && (vm.vErrors.count() === 0)
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
  padding: 0.875rem 0 0.25rem;
  text-align: right;
}
</style>
