<template>
  <div>
    <v-alert
      v-if="message"
      :color="isError ? 'pink lighten-1' : 'success'"
      text
      class="mb-5">
      {{ message }}
    </v-alert>
    <v-progress-circular v-if="isLoading" color="primary darken-2" indeterminate />
    <div v-else-if="isError">
      <router-link :to="{ name: 'forgot-password' }">
        <v-icon size="20">mdi-arrow-top-right-thick</v-icon>
        Click here to send another reset email.
      </router-link>
      <v-btn :to="{ name: 'login' }" tag="a" text class="mt-7">
        <v-icon class="pr-2">mdi-arrow-left</v-icon>Back to login page
      </v-btn>
    </div>
    <validation-observer
      v-else
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form"
      novalidate>
      <validation-provider
        v-slot="{ errors }"
        vid="password"
        name="password"
        rules="required|alphanumerical|min:6">
        <v-text-field
          v-model="password"
          :error-messages="errors"
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          prepend-inner-icon="mdi-lock"
          outlined
          class="required mb-1" />
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        vid="passwordConfirmation"
        name="password"
        rules="required|confirmed:password">
        <v-text-field
          v-model="passwordConfirmation"
          :error-messages="errors"
          type="password"
          name="passwordConfirmation"
          label="Re-enter password"
          placeholder="Password confirmation"
          prepend-inner-icon="mdi-lock-outline"
          outlined
          class="required" />
      </validation-provider>
      <v-btn
        type="submit"
        color="primary darken-4"
        rounded block dark
        class="my-1">
        Change password
      </v-btn>
    </validation-observer>
  </div>
</template>

<script>
import api from '@/api/auth';
import { delay } from 'bluebird';

const ERRORS = {
  default: 'An error has occurred!',
  resetToken: 'Invalid reset password URL!'
};

export default {
  data: () => ({
    password: '',
    passwordConfirmation: '',
    message: null,
    isError: false,
    isLoading: true
  }),
  computed: {
    token: vm => vm.$route.params.token
  },
  methods: {
    submit() {
      const { token, password } = this;
      return api.resetPassword(token, password)
        .then(() => {
          this.isError = false;
          this.message = 'Password changed successfully. Redirecting...';
          return delay(2000);
        })
        .then(() => this.$router.push('/'))
        .catch(() => {
          this.isError = true;
          this.message = ERRORS.default;
        });
    }
  },
  created() {
    return api.validateResetToken(this.token)
      .catch(() => {
        this.isError = true;
        this.message = ERRORS.resetToken;
      })
      .finally(() => (this.isLoading = false));
  }
};
</script>

<style lang="scss" scoped>
.v-input ::v-deep label {
  padding-right: 0.25rem;
  background: #ececec;
}
</style>
