<template>
  <v-form @submit.prevent="updateUser">
    <v-row class="pt-2 px-4 mx-3">
      <v-col cols="12">
        <v-text-field
          v-model="userData.email"
          v-validate="{ required: true, email: true, 'unique-email': user }"
          :error-messages="vErrors.collect('email')"
          name="email"
          label="Email" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="userData.firstName"
          v-validate="'required|min:2|max:20'"
          :error-messages="vErrors.collect('firstName')"
          data-vv-as="First name"
          data-vv-name="firstName"
          label="First name" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="userData.lastName"
          v-validate="'required|min:2|max:20'"
          :error-messages="vErrors.collect('lastName')"
          data-vv-as="Last Name"
          data-vv-name="lastName"
          label="Last name" />
      </v-col>
    </v-row>
    <v-row class="pb-3 px-4 mx-6">
      <v-spacer />
      <v-btn
        @click="resetForm"
        :disabled="!hasChanges && !vErrors.any()"
        text>
        Cancel
      </v-btn>
      <v-btn
        :disabled="!hasChanges || vErrors.any()"
        outlined
        type="submit">
        Update
      </v-btn>
    </v-row>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import pick from 'lodash/pick';
import { withValidation } from 'utils/validation';

const ATTRIBUTES = ['firstName', 'lastName', 'email'];

const resetUser = () => ({
  firstName: null,
  lastName: null,
  email: null
});

export default {
  name: 'user-info',
  mixins: [withValidation()],
  data: () => ({ userData: resetUser() }),
  computed: {
    ...mapState({ user: state => state.auth.user }),
    hasChanges: vm => ATTRIBUTES.some(key => vm.userData[key] !== vm.user[key])
  },
  methods: {
    ...mapActions(['updateInfo']),
    async updateUser() {
      const isValid = this.$validator.validateAll();
      if (!isValid) return;
      return this.updateInfo(pick(this.userData, ATTRIBUTES))
        .then(() => {
          this.$snackbar.show('User information updated!');
          return this.resetForm();
        })
        .catch(() => this.$snackbar.error('Something went wrong!'));
    },
    resetForm() {
      this.$validator.reset();
      return Object.assign(this.userData, pick(this.user, ATTRIBUTES));
    }
  },
  created() {
    return this.resetForm();
  }
};
</script>
