<template>
  <tailor-dialog v-model="isVisible" header-icon="mdi-lock">
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        color="primary darken-1"
        text>
        <v-icon small class="mr-1">mdi-lock</v-icon>Change Password
      </v-btn>
    </template>
    <template v-slot:header>Change Password</template>
    <template v-slot:body>
      <validation-observer v-slot="{ invalid }" ref="form">
        <validation-provider
          v-slot="{ errors }"
          rules="required"
          name="currentPassword">
          <v-text-field
            v-model="currentPassword"
            :error-messages="errors"
            type="password"
            label="Current password"
            placeholder="Enter current password..."
            data-vv-name="currentPassword"
            data-vv-as="Current Password"
            outlined
            class="my-4" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          rules="required|alphanumerical|min:3|is_not:@currentPassword"
          name="newPassword">
          <v-text-field
            ref="newPassword"
            v-model="newPassword"
            :error-messages="errors"
            type="password"
            label="New password"
            placeholder="Enter new password..."
            data-vv-name="newPassword"
            data-vv-as="New password"
            outlined
            class="mb-4" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          rules="required|confirmed:newPassword"
          name="passwordConfirmation">
          <v-text-field
            v-model="passwordConfirmation"
            :error-messages="errors"
            type="password"
            label="Confirm new password"
            placeholder="Confirm new password..."
            data-vv-name="passwordConfirmation"
            data-vv-as="Password confirmation"
            outlined
            class="mb-4" />
        </validation-provider>
        <div class="pl-2 py-4">
          <router-link :to="{ name: 'forgot-password' }" class="float-left">
            Forgot password ?
          </router-link>
          <div class="float-right">
            <v-btn @click="hide" text>Cancel</v-btn>
            <v-btn @click="submit" :disabled="invalid" color="primary" text>
              Update
            </v-btn>
          </div>
        </div>
      </validation-observer>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import TailorDialog from '@/components/common/TailorDialog';

const defaultData = () => ({
  currentPassword: null,
  newPassword: null,
  passwordConfirmation: null
});

export default {
  name: 'change-password-dialog',
  data: () => ({ ...defaultData(), isVisible: false }),
  methods: {
    ...mapActions(['changePassword', 'logout']),
    hide() {
      this.isVisible = false;
      return this.reset();
    },
    reset() {
      this.$refs.form.reset();
      return Object.assign(this, defaultData());
    },
    async submit() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
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
