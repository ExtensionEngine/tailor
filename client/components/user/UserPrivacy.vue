<template>
  <v-card class="elevation-2">
    <v-layout align-center>
      <v-flex>
        <v-layout row mx-0>
          <v-toolbar class="elevation-0" height="113" color="light-blue darken-3" dark>
            <v-icon>mdi-lock-open</v-icon>
            <v-toolbar-title>Change Password</v-toolbar-title>
          </v-toolbar>
        </v-layout>
        <v-form @submit.prevent="submit">
          <v-layout column mx-5 mt-4>
            <v-text-field
              v-validate="{ required: true, alphanumerical: true, min: 6 }"
              v-model="currentPassword"
              :error-messages="vErrors.first('currentPassword')"
              data-vv-as="current password"
              type="password"
              name="currentPassword"
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
            <v-card-actions>
              <v-layout my-4 justify-end>
                <v-btn
                  :disabled="!isValidated"
                  type="submit"
                  color="light-blue darken-3"
                  outline>
                  Submit
                </v-btn>
              </v-layout>
            </v-card-actions>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-card>
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
    isValidated: vm => Object.keys(vm.vFields).every(name => {
      return vm.vFields[name] && vm.vFields[name].validated;
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
            .catch(() => this.$snackbar.error('Incorrect current password.'))
            .finally(() => {
              this.currentPassword = this.newPassword = this.reNewPassword = '';
              requestAnimationFrame(() => this.$validator.reset());
            });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card__actions {
  padding: 0;

  .v-btn {
    width: 125px;
    min-width: 100px;
    margin-bottom: 10px;
  }
}
</style>
