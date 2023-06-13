<template>
  <tailor-dialog v-model="isVisible" header-icon="mdi-lock">
    <template #activator="{ on }">
      <v-btn
        v-on="on"
        color="primary darken-3"
        text>
        <v-icon small class="mr-1">mdi-lock</v-icon>Change Password
      </v-btn>
    </template>
    <template #header>Change Password</template>
    <template #body>
      <validation-observer
        ref="form"
        v-slot="{ pristine, invalid }"
        @submit.prevent="$refs.form.handleSubmit(submit)"
        tag="form"
        novalidate>
        <validation-provider
          v-slot="{ errors }"
          vid="currentPassword"
          name="current password"
          rules="required">
          <v-text-field
            v-model="currentPassword"
            :error-messages="errors"
            type="password"
            label="Current password"
            placeholder="Enter current password..."
            outlined
            class="required my-4" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          vid="newPassword"
          name="new password"
          rules="required|alphanumerical|min:6|is_not:@currentPassword">
          <v-text-field
            v-model="newPassword"
            :error-messages="errors"
            type="password"
            label="New password"
            placeholder="Enter new password..."
            outlined
            class="required mb-4" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          vid="confirmedPassword"
          name="new password"
          rules="required|confirmed:newPassword">
          <v-text-field
            v-model="passwordConfirmation"
            :error-messages="errors"
            type="password"
            label="Confirm new password"
            placeholder="Confirm new password..."
            outlined
            class="required mb-4" />
        </validation-provider>
        <div class="d-flex align-center pl-2 py-4">
          <router-link :to="{ name: 'forgot-password' }">
            Forgot password ?
          </router-link>
          <v-btn @click="hide" text class="ml-auto">Cancel</v-btn>
          <v-btn
            :disabled="pristine || invalid"
            type="submit"
            color="primary darken-4"
            text>
            Update
          </v-btn>
        </div>
      </validation-observer>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import TailorDialog from '@/components/common/TailorDialog.vue';

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
    submit() {
      const { currentPassword, newPassword } = this;
      return this.changePassword({ currentPassword, newPassword })
        .then(() => this.$snackbar.show('Password changed!'))
        .then(() => this.logout())
        .then(() => this.$router.push({ name: 'login' }))
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
