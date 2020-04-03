<template>
  <div>
    <v-alert
      :value="!!error"
      color="grey darken-3"
      text
      class="mb-5">
      {{ error }}
    </v-alert>
    <form @submit.prevent="submit">
      <v-text-field
        ref="password"
        v-model="password"
        v-validate="{ required: true, min: 6, alphanumerical: true }"
        :error-messages="vErrors.collect('password')"
        prepend-inner-icon="mdi-lock"
        type="password"
        name="password"
        label="Password"
        placeholder="Password"
        outlined
        class="mb-1" />
      <v-text-field
        v-model="passwordConfirmation"
        v-validate="{ required: true, confirmed: 'password' }"
        :error-messages="vErrors.collect('passwordConfirmation')"
        type="password"
        name="passwordConfirmation"
        label="Please re-enter your password"
        placeholder="Password"
        data-vv-as="password"
        prepend-inner-icon="mdi-lock-outline"
        outlined />
      <v-btn
        :disabled="!isValid"
        type="submit"
        color="primary darken-1"
        class="my-1">
        Change password
      </v-btn>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { withValidation } from 'utils/validation';

export default {
  mixins: [withValidation()],
  data: () => ({
    error: null,
    password: '',
    passwordConfirmation: ''
  }),
  computed: {
    isValid() {
      const { password, passwordConfirmation, vErrors } = this;
      return password && passwordConfirmation && vErrors.count() === 0;
    }
  },
  methods: {
    ...mapActions(['resetPassword']),
    async submit() {
      const { token } = this.$route.params;
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      return this.resetPassword({ password: this.password, token })
        .then(() => this.$router.push('/'))
        .catch(() => (this.error = 'An error has occurred!'));
    }
  }
};
</script>
