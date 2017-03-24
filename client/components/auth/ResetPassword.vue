<template>
  <div>
    <form @submit.prevent="submit">
      <div class="form-group" :class="{'has-error': vErrors.has('password') }">
        <input
          v-model="password"
          v-validate="'required|min:6'"
          class="form-control"
          type="password"
          name="password"
          placeholder="Password"/>
          <span v-show="vErrors.has('password')" class="help-block">{{ vErrors.first('password') }}</span>
      </div>
      <div class="form-group" :class="{'has-error': vErrors.has('password-match') }">
        <input
          v-validate="'confirmed:password'"
          class="form-control"
          type="password"
          name="password-match"
          placeholder="Please re enter your password"/>
          <span v-show="vErrors.has('password-match')" class="help-block">{{ vErrors.first('password-match') }}</span>
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
      this.$validator.validateAll()
        .then(() => { return this.resetPassword({ password: this.password, token: this.$route.params.token }) })
        .then(() => this.$router.push('/'));
    }
  }
};
</script>
