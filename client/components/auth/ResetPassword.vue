<template>
  <div>
    <div class="message"><span>{{ error }}</span></div>
    <form @submit.prevent="submit">
      <div :class="{ 'has-error': vErrors.has('password') }" class="form-group">
        <input
          v-validate="{ required: true, min: 6, alphanumerical: true }"
          ref="password"
          v-model="password"
          class="form-control"
          name="password"
          type="password"
          placeholder="Password"/>
        <span class="help-block">{{ vErrors.first('password') }}</span>
      </div>
      <div
        :class="{ 'has-error': vErrors.has('passwordConfirmation') }"
        class="form-group">
        <input
          v-validate="{ required: true, confirmed: 'password' }"
          data-vv-as="password"
          class="form-control"
          name="passwordConfirmation"
          type="password"
          placeholder="Please re-enter your password"/>
        <span class="help-block">
          {{ vErrors.first('passwordConfirmation') }}
        </span>
      </div>
      <button
        :disabled="!isValid"
        class="btn btn-default btn-block"
        type="submit">
        Change password
      </button>
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
