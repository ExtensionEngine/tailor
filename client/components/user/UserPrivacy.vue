<template>
  <v-card class="elevation-2">
    <v-container class="user-privacy-container">
      <v-card-title class="header elevation-2 primary" >
        <v-icon>mdi-lock-open</v-icon>
        <h4 class="title">Change Password</h4>
      </v-card-title>
      <v-form @submit.prevent="submit">
        <v-layout class="fields-container">
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
              v-validate="{ required: true, is_not: currentPassword , alphanumerical: true, min: 6 }"
              ref="newPassword"
              v-model="newPassword"
              :error-messages="vErrors.first('newPassword')"
              data-vv-as="new password"
              type="password"
              name="newPassword"
              label="New password"/>
            <v-text-field
              v-validate="{ required: true, confirmed: 'newPassword' }"
              v-model="confirmationPassword"
              :error-messages="vErrors.first('confirmationPassword')"
              data-vv-as="new password"
              type="password"
              name="confirmationPassword"
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
    </v-container>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { withValidation } from 'utils/validation';

const snackOpts = { right: true };

export default {
  name: 'user-privacy',
  mixins: [withValidation()],
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmationPassword: ''
    };
  },
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    isValidated: vm => Object.keys(vm.vFields).every(name => {
      return vm.vFields[name] && vm.vFields[name].validated;
    })
  },
  methods: {
    ...mapActions('auth', ['changePassword', 'logout']),
    submit() {
      const { currentPassword, newPassword } = this;
      this.$validator.validateAll()
        .then(isValid => {
          if (!isValid) return this.$snackbar.error('Validation failed!');
          return this.changePassword({ currentPassword, newPassword })
            .finally(() => {
              this.currentPassword = this.newPassword = this.confirmationPassword = '';
              requestAnimationFrame(() => this.$validator.reset());
            })
            .then(() => this.$snackbar.success('Password changed.', snackOpts))
            .then(() => this.logout())
            .catch(() => this.$snackbar.error('An error has occurred!', snackOpts));
        });
    }
  }
};
</script>

<style lang="scss" scoped>
$color: #fff;

.user-privacy-container {
  padding: 0;
}

.header {
  height: 55px;
  color: $color;

  .title {
    margin: 0 8px;
    font-weight: 300;
  }

  .v-icon {
    margin-right: 8px;
    color: inherit;
  }
}

.fields-container {
  flex-direction: column;
  margin: 0 48px;
  margin-top: 24px;
}

.fields-box {
  margin: 0 38px;
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
