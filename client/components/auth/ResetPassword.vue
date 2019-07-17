<template>
  <div>
    <div class="message"><span>{{ error }}</span></div>
    <form @submit.prevent="submit">
      <div class="form-group">
        <v-text-field
          v-validate="{ required: true, min: 6, alphanumerical: true }"
          ref="password"
          v-model="password"
          :error-messages="vErrors.collect('password')"
          name="password"
          type="password"
          label="Password"/>
      </div>
      <div class="form-group">
        <v-text-field
          v-validate="{ required: true, confirmed: 'password' }"
          :error-messages="vErrors.collect('passwordConfirmation')"
          data-vv-as="password"
          name="passwordConfirmation"
          type="password"
          label="Please re-enter your password"/>
      </div>
      <v-btn :disabled="!isValid" color="primary" outline block type="submit">
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
      password: ''
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
      const token = this.$route.params.token;
      this.$validator.validateAll().then(result => {
        return this.resetPassword({ password: this.password, token })
          .then(() => this.$router.push('/'))
          .catch(() => (this.error = 'An error has occurred!'));
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  margin-top: 10px;
}
</style>
