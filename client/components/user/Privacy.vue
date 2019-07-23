<template>
  <v-card class="elevation-2">
    <v-card-title class="elevation-2 primary" >
      <v-icon>mdi-lock-open</v-icon>
      <h4>Change Password</h4>
    </v-card-title>
    <v-form @submit.prevent="submit">
      <v-card-text>
        <v-layout class="form-inputs">
          <v-text-field
            v-validate="{ required: true, alphanumerical: true, min: 6 }"
            v-model="currentPassword"
            :error-messages="vErrors.first('currentPassword')"
            data-vv-as="current password"
            type="password"
            name="currentPassword"
            label="Current password"/>
          <v-text-field
            v-validate="{
              required: true,
              is_not: currentPassword,
              alphanumerical: true,
              min: 6
            }"
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
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-layout class="form-controls">
          <v-spacer/>
          <v-btn
            :disabled="!hasChanges"
            @click.prevent="reset"
            color="pink"
            flat>
            Cancel
          </v-btn>
          <v-btn
            :disabled="!isValid"
            type="submit"
            color="light-blue darken-3"
            flat>
            Submit
          </v-btn>
        </v-layout>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import { withValidation } from 'utils/validation';

const snackOpts = { right: true };

const defaultData = () => ({
  currentPassword: null,
  newPassword: null,
  confirmationPassword: null
});

export default {
  name: 'user-privacy',
  mixins: [withValidation()],
  data: () => defaultData(),
  computed: {
    isValid: vm => Object.keys(vm.vFields).every(name => vm.vFields[name].valid),
    hasChanges: vm => Object.keys(vm.vFields).some(name => vm.vFields[name].changed)
  },
  methods: {
    ...mapActions(['changePassword', 'logout']),
    reset() {
      Object.assign(this, defaultData());
      return this.$validator.reset();
    },
    submit() {
      const { currentPassword, newPassword, $snackbar } = this;
      return this.$validator.validateAll()
        .then(isValid => {
          if (!isValid) return $snackbar.error('Validation failed!', snackOpts);
          return this.changePassword({ currentPassword, newPassword })
            .finally(() => this.reset())
            .then(() => $snackbar.success('Password changed.', snackOpts))
            .then(() => this.logout())
            .catch(() => $snackbar.error('An error has occurred!', snackOpts));
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card__title {
  height: 55px;
  color: #fff;

  .v-icon {
    margin-right: 8px;
    color: inherit;
  }

  h4 {
    margin: 0 8px;
    font-weight: 300;
  }
}

.form-inputs {
  flex-direction: column;
  margin: 16px 64px;

  .v-input {
    height: 64px;
    margin: 4px 0;
  }
}

.form-controls {
  margin: 0 64px 24px;
}
</style>
