<template>
  <div>
    <form @submit.prevent="submit">
      <div class="form-group" :class="{ 'has-error': vErrors.has('password') }">
        <input
          v-model="password"
          v-validate="{ rules: { required: true, min: 6, alphanumerical: true } }"
          class="form-control"
          type="password"
          name="password"
          placeholder="Password"/>
        <span class="help-block">
          {{ vErrors.first('password') }}
        </span>
      </div>
      <div class="form-group" :class=" {'has-error': vErrors.has('passwordMatch') }">
        <input
          v-validate="{ rules: { confirmed: 'password'} }"
          class="form-control"
          type="password"
          name="passwordMatch"
          placeholder="Please re-enter your password"/>
          <span class="help-block">{{ vErrors.first('passwordMatch') }}</span>
      </div>
      <button type="submit" class="btn btn-default btn-block">
        Change password
      </button>
      <div class="error-message">
        <span v-if="vErrors.has('default')">{{ vErrors.first('default') }}</span>
      </div>
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
      this.$validator.validateAll()
        .then(() => {
          return this.resetPassword({
            password: this.password,
            token: this.$route.params.token
          });
        })
        .then(() => this.$router.push('/'))
        .catch(() => { this.vErrors.add('default', 'An error has occurred!'); });
    }
  }
};
</script>

<style>
.error-message {
  margin-top: 10px;
  color: #a94442;
}
</style>