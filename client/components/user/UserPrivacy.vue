<template>
  <v-layout align-center>
    <v-card class="card-container">
      <h1 class="title">Change password</h1>
      <form @submit.prevent="submit">
        <v-text-field
          v-validate="{ required: true, alphanumerical: true, min: 6 }"
          v-model="currentPassword"
          :error-messages="vErrors.first('currentPassword')"
          data-vv-as="current password"
          type="password"
          data-vv-name="currentPassword"
          label="Current password"/>
        <v-text-field
          v-validate="{ required: true, alphanumerical: true, min: 6 }"
          ref="newPassword"
          v-model="newPassword"
          :error-messages="vErrors.first('newPassword')"
          data-vv-as="new password"
          type="password"
          name="newPassword"
          label="New password"/>
        <v-text-field
          v-validate="{ required: true, confirmed: 'newPassword' }"
          v-model="reNewPassword"
          :error-messages="vErrors.first('passwordConfirmation')"
          data-vv-as="new password"
          type="password"
          name="passwordConfirmation"
          label="Please re-enter your new password"/>
        <v-btn :disabled="isDisabled" type="submit" color="blue-grey darken-1" flat large>
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
    isDisabled: vm => Object.keys(vm.vFields).some(name => {
      return vm.vFields[name] && vm.vFields[name].invalid;
    })
  },
  methods: {
    ...mapActions(['changePassword']),
    submit() {
      const { currentPassword, newPassword } = this;
      this.$validator.validateAll()
        .then(isValid => {
          if (!isValid) return this.$snackbar.error('Validation failed!');
          return this.changePassword({ currentPassword, newPassword })
            .then(() => this.$snackbar.success('Password changed.'))
            .catch(() => {
              this.currentPassword = this.newPassword = this.reNewPassword = '';
              this.$snackbar.error('Incorrect current password.');
            })
            .finally(() => requestAnimationFrame(() => this.$validator.reset()));
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
