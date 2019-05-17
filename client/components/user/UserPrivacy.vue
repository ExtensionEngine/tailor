<template>
  <v-card class="elevation-2">
    <v-layout class="main-container">
      <v-flex>
        <v-flex class="header">
          <v-card class="elevation-2" color="blue-grey darken-2" dark>
            <v-card-title>
              <v-icon>mdi-lock-open</v-icon>
              <h4 class="title">Change Password</h4>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-form @submit.prevent="submit">
          <v-layout class="fields-layout">
            <v-flex class="fields-box">
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
            </v-flex>
            <v-card-actions>
              <v-layout class="btn-actions">
                <v-btn :disabled="!isValidated" type="submit" color="light-blue darken-3" flat>
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
.main-container {
  align-items: center;
}

.header {
  margin-top: -40px;
  padding: 16px 16px;

  .title {
    margin-bottom: 8px;
    font-weight: 300;
  }

  .v-icon {
    margin-right: 8px;
  }
}

.fields-layout {
  flex-direction: column;
  margin: 0 48px;
  margin-top: 24px;
}

.fields-box {
  margin: 0 24px;
}

.btn-actions {
  justify-content: flex-end;
  margin: 24px 0;

  .v-btn {
    width: 125px;
    min-width: 100px;
    margin-bottom: 10px;
  }
}

.v-card__actions {
  padding: 0;
}
</style>
