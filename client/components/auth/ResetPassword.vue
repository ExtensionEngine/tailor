<template>
  <div>
    <v-alert :value="!!error" color="pink lighten-1" text class="mb-5">
      {{ error }}
    </v-alert>
    <v-progress-circular v-if="isLoading" color="primary darken-2" indeterminate />
    <router-link v-else-if="error" :to="{ name: 'forgot-password' }">
      <v-icon size="20">mdi-arrow-top-right-thick</v-icon>
      Click here to send another reset email.
    </router-link>
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

const ERRORS = {
  default: 'An error has occurred!',
  resetToken: 'Invalid reset password URL!'
};

export default {
  data: () => ({
    password: '',
    passwordConfirmation: '',
    error: null,
    isLoading: true
  }),
  computed: {
    token: vm => vm.$route.params.token
  },
  methods: {
    submit() {
      const { token, password } = this;
      return api.resetPassword(token, password)
        .then(() => this.$router.push('/'))
        .catch(() => (this.error = ERRORS.default));
    }
  },
  created() {
    return api.validateResetToken(this.token)
      .catch(() => (this.error = ERRORS.resetToken))
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
