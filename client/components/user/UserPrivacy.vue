<template>
  <v-layout align-center>
    <v-card class="card-container">
      <v-layout ma-4 justify-center>
        <v-chip color="light-blue darken-3" text-color="white">
          <v-icon left>mdi-lock-open</v-icon>
          Change password
        </v-chip>
      </v-layout>
      <v-form ref="form" @submit.prevent="submit">
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
      </v-form>
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
            .finally(() => requestAnimationFrame(() => {
              this.$validator.reset();
              this.$refs.form.reset();
            }));
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

/deep/ {
  .v-chip__content {
    padding: 20px 20px !important;
  }
}
</style>
