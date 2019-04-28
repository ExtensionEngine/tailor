<template>
  <v-layout align-center>
    <v-card class="card-container">
      <h1 class="title">Change password</h1>
      <form @submit.prevent="submit">
        <v-text-field
          v-validate="'required|alphanumerical|min:6'"
          ref="password"
          v-model="password"
          :error-messages="vErrors.first('password')"
          type="password"
          data-vv-name="password"
          label="Password"/>
        <v-text-field
          v-validate="'required|confirmed:password'"
          :error-messages="vErrors.first('passwordConfirmation')"
          data-vv-as="confirmedPassword"
          type="password"
          data-vv-name="confirmedPassword"
          label="Please re-enter your password"/>
        <v-btn :disabled="!isValid" type="submit" color="blue-grey darken-1" flat large>
          Submit
        </v-btn>
      </form>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import { withValidation } from 'utils/validation';
import EventBus from 'EventBus';

const appChannel = EventBus.channel('app');

export default {
  mixins: [withValidation()],
  data() {
    return {
      password: ''
    };
  },
  computed: {
    ...mapGetters(['user']),
    isValid() {
      return this.password && !this.vErrors.count();
    },
    error() {
      return { color: 'error', message: 'An error has occurred!' };
    },
    success() {
      return { color: 'success', message: 'Password changed.' };
    }
  },
  methods: {
    ...mapActions(['changePassword']),
    submit() {
      this.$validator.validateAll().then(result => {
        return this.changePassword({ password: this.password })
          .then(() => {
            this.$nextTick(() => this.$validator.reset());
            appChannel.emit('showSnackbar', this.success);
          })
          .catch(() => appChannel.emit('showSnackbar', this.error));
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.card-container {
  width: 100%;
  padding: 30px 30px;
  background-color: white;
}

h1 {
  margin-bottom: 30px;
}
</style>
