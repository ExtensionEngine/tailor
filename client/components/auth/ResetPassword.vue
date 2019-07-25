<template>
  <div>
    <div class="message">{{ error }}</div>
    <form @submit.prevent="submit">
      <v-text-field
        v-validate="{ required: true, min: 6, alphanumerical: true }"
        ref="password"
        v-model="password"
        :error-messages="vErrors.collect('password')"
        prepend-icon="mdi-lock"
        name="password"
        type="password"
        label="Password"
        class="my-1"/>
      <v-text-field
        v-validate="{ required: true, confirmed: 'password' }"
        v-model="passwordConfirmation"
        :error-messages="vErrors.collect('passwordConfirmation')"
        prepend-icon="mdi-lock-outline"
        data-vv-as="password"
        name="passwordConfirmation"
        type="password"
        label="Please re-enter your password"
        class="my-1"/>
      <v-btn
        :disabled="!isValid"
        color="primary"
        outline
        block
        type="submit"
        class="mt-3">
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
  data() {
    return {
      error: null,
      password: '',
      passwordConfirmation: ''
    };
  },
  computed: {
    isValid() {
      return this.password && this.vErrors.count() === 0;
    }
  },
  methods: {
    ...mapActions(['resetPassword']),
    submit() {
      const { token } = this.$route.params;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        return this.resetPassword({ password: this.password, token })
          .then(() => this.$router.push('/'))
          .catch(() => (this.error = 'An error has occurred!'));
      });
    }
  }
};
</script>
