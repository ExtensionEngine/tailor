<template>
  <div>
    <div class="message"><span v-if="message">{{ message }}</span></div>
    <form @submit.prevent="submit">
      <div class="form-group">
        <input
          v-model="password"
          class="form-control"
          type="password"
          placeholder="Password"/>
      </div>
      <div class="form-group">
        <input
          v-model="passwordConfirmation"
          class="form-control"
          type="password"
          placeholder="Please re-enter your password"/>
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
      password: '',
      passwordConfirmation: '',
      message: ''
    };
  },
  methods: {
    ...mapActions(['resetPassword']),
    isValid() {
      this.message = '';
      let valid = this.password === this.passwordConfirmation;
      if (!valid) this.message = 'Invalid password';
      return valid;
    },
    submit() {
      if (!this.isValid()) return;
      this.resetPassword({ password: this.password, token: this.$route.params.token })
        .then(() => this.$router.push('/'))
        .catch(() => (this.message = 'Error'));
    }
  }
};
</script>
