<template>
  <div>
    <v-alert
      :value="!!error"
      color="grey darken-3"
      text
      class="mb-5">
      {{ error }}
    </v-alert>
    <validation-observer v-slot="{ invalid }" ref="form">
      <form @submit.prevent="submit">
        <validation-provider
          v-slot="{ errors }"
          name="Password"
          rules="required|alphanumerical|min:6">
          <v-text-field
            ref="password"
            v-model="password"
            :error-messages="errors"
            prepend-inner-icon="mdi-lock"
            type="password"
            name="password"
            label="Password"
            placeholder="Password"
            outlined
            class="mb-1" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="Password Confirmation"
          rules="required|confirmed:password">
          <v-text-field
            v-model="passwordConfirmation"
            :error-messages="errors"
            type="password"
            name="passwordConfirmation"
            label="Re-enter password"
            placeholder="Password confirmation"
            data-vv-as="password"
            prepend-inner-icon="mdi-lock-outline"
            outlined />
        </validation-provider>
        <v-btn
          :disabled="invalid"
          type="submit"
          color="primary darken-1"
          class="my-1">
          Change password
        </v-btn>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data: () => ({
    error: null,
    password: '',
    passwordConfirmation: ''
  }),
  methods: {
    ...mapActions(['resetPassword']),
    async submit() {
      const { token } = this.$route.params;
      const { valid } = this.$refs.form.validate();
      if (!valid) return;
      return this.resetPassword({ password: this.password, token })
        .then(() => this.$router.push('/'))
        .catch(() => (this.error = 'An error has occurred!'));
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input ::v-deep label {
  padding-right: 0.25rem;
  background: #fff;
}
</style>
