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
    <validation-observer
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form">
      <validation-provider
        v-slot="{ errors }"
        name="email"
        rules="required|email">
        <v-text-field
          v-model="email"
          :error-messages="errors"
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          autocomplete="username"
          prepend-inner-icon="mdi-email-outline"
          outlined
          class="mb-1" />
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        name="password"
        rules="required">
        <v-text-field
          v-model="password"
          :error-messages="errors"
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          prepend-inner-icon="mdi-lock-outline"
          autocomplete="current-password"
          outlined />
      </validation-provider>
      <div class="d-flex">
        <v-spacer />
        <v-btn type="submit" color="primary darken-1">Log in</v-btn>
      </div>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">
          Forgot password?
        </router-link>
      </div>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
const LOGIN_ERR_MESSAGE = 'The email or password you entered is incorrect.';

export default {
  name: 'user-login',
  data: () => ({
    email: '',
    password: '',
    message: ''
  }),
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
