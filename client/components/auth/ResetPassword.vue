<template>
  <div>
    <v-alert :value="!!error" color="pink lighten-1" text class="mb-5">
      {{ error }}
    </v-alert>
    <v-progress-circular v-if="isLoading" color="primary darken-2" indeterminate />
    <validation-observer
      v-else
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form"
      novalidate>
      <template v-if="!error">
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
      </template>
      <v-btn v-if="error" :to="{ name: 'forgot-password' }" tag="a" text class="mt-7">
        <v-icon class="pr-2">mdi-arrow-top-right-thick</v-icon>
        Go to Forgot Password
      </v-btn>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const INVALID_TOKEN_ERROR = 'Invalid reset token!';

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
    ...mapActions(['resetPassword', 'validateResetToken']),
    submit() {
      const { token, password } = this;
      return this.resetPassword({ password, token })
        .then(() => this.$router.push('/'))
        .catch(() => (this.error = INVALID_TOKEN_ERROR));
    }
  },
  created() {
    const { token } = this;
    return this.validateResetToken({ token })
      .catch(() => (this.error = INVALID_TOKEN_ERROR))
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
