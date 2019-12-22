<template>
  <v-row class="pt-3 px-4 mr-2">
    <v-spacer />
    <tailor-dialog v-model="isVisible" header-icon="mdi-lock">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          color="primary"
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
          data-vv-as="Current Password"
          data-vv-name="currentPassword"
          placeholder="Enter current password..."
          outlined
          class="mb-4" />
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
          data-vv-as="New password"
          data-vv-name="newPassword"
          outlined
          class="mb-4" />
        <v-text-field
          v-model="passwordConfirmation"
          v-validate="{ required: true, confirmed: 'newPassword' }"
          :error-messages="vErrors.first('passwordConfirmation')"
          data-vv-as="Password confirmation"
          data-vv-name="passwordConfirmation"
          type="password"
          label="Confirm new password"
          placeholder="Confirm new password..."
          outlined
          class="mb-4" />
      </template>
      <template v-slot:actions>
        <router-link :to="{ name: 'forgot-password' }" class="mr-6">
          Forgot password ?
        </router-link>
        <v-btn @click="hide" text>Cancel</v-btn>
        <v-btn @click="submit" :disabled="vErrors.any()" color="primary" text>
          Update
        </v-btn>
      </template>
    </tailor-dialog>
  </v-row>
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
  name: 'user-security',
  mixins: [withValidation()],
  data: () => ({
    ...defaultData(),
    isVisible: false
  }),
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

<style lang="scss" scoped>
.v-input {
  height: 72px;
}
</style>
