<template>
  <v-layout pb-3 px-4 mr-2>
    <v-spacer />
    <v-btn
      @click="isVisible = true"
      color="primary"
      outline>
      Change Password
    </v-btn>
    <v-dialog v-model="isVisible" v-hotkey="{ esc: hide }" width="700px">
      <v-form @submit.prevent="submit">
        <v-card class="pa-3">
          <v-card-title class="headline">
            <v-avatar color="secondary" size="38" class="mr-2">
              <v-icon color="white">mdi-security</v-icon>
            </v-avatar>
            Security
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="currentPassword"
              v-validate="{ required: true }"
              :error-messages="vErrors.first('currentPassword')"
              data-vv-as="Current Password"
              data-vv-name="currentPassword"
              type="password"
              label="Current password" />
            <v-text-field
              ref="newPassword"
              v-model="newPassword"
              v-validate="{
                required: true,
                is_not: currentPassword,
                alphanumerical: true,
                min: 6
              }"
              :error-messages="vErrors.first('newPassword')"
              data-vv-as="New password"
              data-vv-name="newPassword"
              type="password"
              label="New password" />
            <v-text-field
              v-model="confirmationPassword"
              v-validate="{ required: true, confirmed: 'newPassword' }"
              :error-messages="vErrors.first('confirmationPassword')"
              data-vv-as="Confirmation password"
              data-vv-name="confirmationPassword"
              type="password"
              label="Confirm new password" />
          </v-card-text>
          <v-card-actions class="mx-2">
            <router-link
              :to="{ name: 'forgot-password' }"
              class="primary--text text--darken-4">
              Forgot password ?
            </router-link>
            <v-spacer />
            <v-btn @click="hide" flat color="secondary">Cancel</v-btn>
            <v-btn
              :disabled="!hasChanges"
              outline
              color="primary"
              type="submit">
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-layout>
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
  name: 'user-security',
  mixins: [withValidation()],
  data: () => ({
    ...defaultData(),
    isVisible: false
  }),
  computed: {
    hasChanges() {
      return Object.keys(this.vFields).some(name => this.vFields[name].changed);
    }
  },
  methods: {
    ...mapActions(['changePassword', 'logout']),
    hide() {
      Object.assign(this, defaultData());
      this.$validator.reset();
      this.isVisible = false;
    },
    submit() {
      const { currentPassword, newPassword, $snackbar } = this;
      return this.$validator.validateAll()
        .then(isValid => {
          if (!isValid) return $snackbar.error('Validation failed!', snackOpts);
          return this.changePassword({ currentPassword, newPassword })
            .then(() => $snackbar.success('Password changed!', snackOpts))
            .then(() => this.logout())
            .catch(() => $snackbar.error(`Current password isn't valid!`, snackOpts));
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-input {
  height: 72px;
}
</style>
