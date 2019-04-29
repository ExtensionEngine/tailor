<template>
  <v-layout align-center>
    <v-card class="card-container">
      <h1 class="title">Change password</h1>
      <form @submit.prevent="submit">
        <v-text-field
          v-validate="'required|alphanumerical|min:6'"
          v-model="currentPassword"
          :error-messages="vErrors.first('currentPassword')"
          type="password"
          data-vv-name="currentPassword"
          label="Current password"/>
        <v-text-field
          v-validate="'required|alphanumerical|min:6'"
          ref="newPassword"
          v-model="newPassword"
          :error-messages="vErrors.first('newPassword')"
          type="password"
          name="newPassword"
          label="New password"/>
        <v-text-field
          v-validate="'required|confirmed:newPassword'"
          v-model="reNewPassword"
          :error-messages="vErrors.first('passwordConfirmation')"
          data-vv-as="new password"
          type="password"
          name="passwordConfirmation"
          label="Please re-enter your new password"/>
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

export default {
  mixins: [withValidation()],
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      reNewPassword: ''
    };
  },
  computed: {
    ...mapGetters(['user']),
    isValid() {
      return (this.currentPassword && this.newPassword && !this.vErrors.count());
    }
  },
  methods: {
    ...mapActions(['changePassword']),
    submit() {
      const { currentPassword, newPassword } = this;
      this.$validator.validateAll().then(result => {
        if (!result) return this.$snackbar.error('Validation failed!');
        return this.changePassword({ currentPassword, newPassword })
          .then(() => {
            this.$nextTick(() => this.$validator.reset());
            this.$snackbar.success('Password changed.');
          })
          .catch(({ response: { data: { error: { message } } } }) => {
            this.currentPassword = this.newPassword = this.reNewPassword = '';
            this.$nextTick(() => this.$validator.reset());
            this.$snackbar.error(message);
          });
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
