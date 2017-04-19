<template>
  <div>
    <div class="message"><span>{{ vErrors.first('default') }}</span></div>
    <form @submit.prevent="submit">
      <div :class="{ 'has-error': vErrors.has('password') }" class="form-group">
        <input
          v-model="password"
          v-validate="{ rules: { required: true, min: 6, alphanumerical: true } }"
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
          v-validate="{ rules: { confirmed: 'password'} }"
          data-vv-as="password"
          class="form-control"
          name="passwordConfirmation"
          type="password"
          placeholder="Please re-enter your password"/>
        <span class="help-block">
          {{ vErrors.first('passwordConfirmation') }}
        </span>
      </div>
      <button type="submit" class="btn btn-default btn-block">
        Change password
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex-module';

export default {
  data() {
    return {
      password: ''
    };
  },
  methods: {
    ...mapActions(['resetPassword']),
    submit() {
      const token = this.$route.params.token;
      this.$validator.validateAll()
        .then(() => this.resetPassword({ password: this.password, token }))
        .then(() => this.$router.push('/'))
        .catch(() => (this.vErrors.add('default', 'An error has occurred!')));
    }
  }
};
</script>
