<template>
  <div>
    <v-alert
      :value="!!errorMessage"
      color="pink lighten-1"
      transition="fade-transition"
      dismissible text dense
      class="mb-7 text-left">
      {{ errorMessage }}
    </v-alert>
    <template v-if="oidcEnabled">
      <v-btn
        @click="loginOIDC"
        color="pink accent-4"
        block dark rounded depressed>
        {{ oidcLoginText }}
      </v-btn>
      <v-divider class="auth-divider" />
    </template>
    <validation-observer
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form"
      novalidate>
      <validation-provider
        v-slot="{ errors }"
        name="email"
        rules="required|email">
        <v-text-field
          v-model="email"
          :error-messages="errors"
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          autocomplete="username"
          prepend-inner-icon="mdi-email-outline"
          outlined
          class="required mb-1" />
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        name="password"
        rules="required">
        <v-text-field
          v-model="password"
          :error-messages="errors"
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          prepend-inner-icon="mdi-lock-outline"
          autocomplete="current-password"
          outlined
          class="required" />
      </validation-provider>
      <div class="d-flex mt-1">
        <v-spacer />
        <v-btn
          type="submit"
          color="primary darken-4"
          block dark rounded depressed>
          Log in
        </v-btn>
      </div>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">
          Forgot password?
        </router-link>
      </div>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const LOGIN_ERR_MESSAGE = 'The email or password you entered is incorrect.';
const TOO_MANY_REQ_CODE = 429;
const TOO_MANY_REQ_ERR_MESSAGE = 'Too many login attempts. Please try again later.';
const getOidcErrorMessage = (email, buttonLabel) =>
  `Account with email ${email} does not exist.
  Click "${buttonLabel}" to try with a different account.`;

export default {
  name: 'user-login',
  data: () => ({
    email: '',
    password: '',
    localError: null
  }),
  computed: {
    oidcEnabled: vm => vm.$oidc.enabled,
    oidcLoginText: () => process.env.OIDC_LOGIN_TEXT || 'Login with OAuth',
    accessDenied: vm => vm.$route.query.accessDenied,
    oidcError: vm => vm.accessDenied && getOidcErrorMessage(vm.accessDenied, vm.oidcLoginText),
    errorMessage: vm => vm.oidcError || vm.localError
  },
  methods: {
    ...mapActions(['login']),
    loginOIDC() {
      const action = this.oidcError ? 'reauthenticate' : 'authenticate';
      this.$oidc[action]();
    },
    submit() {
      this.message = '';
      this.login({ email: this.email, password: this.password })
        .then(() => this.$router.push('/'))
        .catch(err => {
          const code = err?.response?.status;
          this.localError = code === TOO_MANY_REQ_CODE
            ? TOO_MANY_REQ_ERR_MESSAGE
            : LOGIN_ERR_MESSAGE;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.auth-divider {
  position: relative;
  margin: 2rem 0;

  &::after {
    content: 'OR';
    position: absolute;
    top: -0.7rem;
    left: calc(50% - 1rem);
    width: 2rem;
    background: #ececec;
  }
}

.options {
  padding: 0.875rem 0 0.25rem;
  text-align: right;
}
</style>
