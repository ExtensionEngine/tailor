<template>
  <tailor-dialog v-model="isVisible" header-icon="mdi-lock">
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        color="grey lighten-4"
        text>
        <v-icon small class="mr-1">mdi-lock</v-icon>Change Password
      </v-btn>
    </template>
    <template v-slot:header>Change Password</template>
    <template v-slot:body>
      <v-text-field
        v-model="currentPassword"
        v-validate="{ required: true }"
        :error-messages="vErrors.first('currentPassword')"
        type="password"
        label="Current password"
        placeholder="Enter current password..."
        data-vv-name="currentPassword"
        data-vv-as="Current Password"
        outlined
        class="my-4" />
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
        type="password"
        label="New password"
        placeholder="Enter new password..."
        data-vv-name="newPassword"
        data-vv-as="New password"
        outlined
        class="mb-4" />
      <v-text-field
        v-model="passwordConfirmation"
        v-validate="{ required: true, confirmed: 'newPassword' }"
        :error-messages="vErrors.first('passwordConfirmation')"
        type="password"
        label="Confirm new password"
        placeholder="Confirm new password..."
        data-vv-name="passwordConfirmation"
        data-vv-as="Password confirmation"
        outlined
        class="mb-4" />
      <div class="pl-2 py-4">
        <router-link :to="{ name: 'forgot-password' }" class="float-left">
          Forgot password ?
        </router-link>
        <div class="float-right">
          <v-btn @click="hide" text>Cancel</v-btn>
          <v-btn @click="submit" :disabled="vErrors.any()" color="primary" text>
            Update
          </v-btn>
        </div>
      </div>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import TailorDialog from '@/components/common/TailorDialog';
import { withValidation } from 'utils/validation';

const defaultData = () => ({
  currentPassword: null,
  newPassword: null,
  passwordConfirmation: null
});

export default {
  name: 'change-password-dialog',
  mixins: [withValidation()],
  data: () => ({ ...defaultData(), isVisible: false }),
  methods: {
    ...mapActions(['changePassword', 'logout']),
    hide() {
      this.isVisible = false;
      return this.reset();
    },
    reset() {
      this.$validator.reset();
      return Object.assign(this, defaultData());
    },
    async submit() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      const { currentPassword, newPassword } = this;
      return this.changePassword({ currentPassword, newPassword })
        .then(() => this.$snackbar.show('Password changed!'))
        .then(() => this.logout())
        .catch(() => this.$snackbar.error('Current password isn\'t valid!'));
    }
  },
  watch: {
    isVisible(val) {
      if (!val) return this.reset();
    }
  },
  components: { TailorDialog }
};
</script>
