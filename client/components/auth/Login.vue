<template>
  <div>
    <div class="message">{{ message }}</div>
    <form @submit.prevent="submit" novalidate>
      <v-text-field
        v-model="email"
        v-validate="{ required: true, email: true }"
        :error-messages="vErrors.collect('email')"
        prepend-icon="mdi-email-outline"
        type="email"
        name="email"
        label="Email"
        class="py-2" />
      <v-text-field
        v-model="password"
        v-validate="{ required: true }"
        :error-messages="vErrors.collect('password')"
        prepend-icon="mdi-lock-outline"
        browser-autocomplete="new-password"
        type="password"
        name="password"
        label="Password"
        class="py-2" />
      <v-btn :disabled="!isValid" color="primary" outline block type="submit">
        Log in
      </v-btn>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">
          Forgot password ?
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { withValidation } from 'utils/validation';
const LOGIN_ERR_MESSAGE = 'User email and password do not match';

export default {
  name: 'login',
  mixins: [withValidation()],
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
  computed: {
    isValid: vm => vm.email && vm.password && (vm.vErrors.count() === 0)
  },
  methods: {
    ...mapActions(['login']),
    submit() {
      this.message = '';
      this.login({ email: this.email, password: this.password })
        .then(() => this.$router.push('/'))
        .catch(() => (this.message = LOGIN_ERR_MESSAGE));
    }
  }
};
</script>

<style lang="scss" scoped>
.options {
  padding: 15px 0 5px;
  text-align: right;
}
</style>
