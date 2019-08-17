<template>
  <v-form @submit.prevent="updateUser">
    <v-layout column pt-2 px-4 mx-3>
      <v-text-field
        v-model="userData.email"
        v-validate="{ required: true, email: true, 'unique-email': user }"
        :error-messages="vErrors.collect('email')"
        data-vv-as="Email"
        data-vv-name="email"
        name="email"
        label="Email" />
      <v-text-field
        v-model="userData.firstName"
        v-validate="'required|min:2|max:20'"
        :error-messages="vErrors.collect('firstName')"
        data-vv-as="First name"
        data-vv-name="firstName"
        label="First name" />
      <v-text-field
        v-model="userData.lastName"
        v-validate="'required|min:2|max:20'"
        :error-messages="vErrors.collect('lastName')"
        data-vv-as="Last Name"
        data-vv-name="lastName"
        label="Last name" />
    </v-layout>
    <v-layout pb-3 px-4 mx-2>
      <v-spacer />
      <v-btn
        @click="resetForm"
        :disabled="!hasChanges && !vErrors.any()"
        flat>
        Cancel
      </v-btn>
      <v-btn
        :disabled="!hasChanges || vErrors.any()"
        outline
        type="submit">
        Update
      </v-btn>
    </v-layout>
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
    userAttrs: () => ATTRIBUTES,
    hasChanges: vm => vm.userAttrs.some(key => vm.userData[key] !== vm.user[key])
  },
  methods: {
    ...mapActions(['updateInfo']),
    updateUser() {
      return this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        return this.updateInfo(pick(this.userData, this.userAttrs))
          .then(() => {
            this.$snackbar.show('User information updated!');
            return this.resetForm();
          })
          .catch(() => this.$snackbar.error('Something went wrong!'));
      });
    },
    resetForm() {
      this.$validator.reset();
      return Object.assign(this.userData, pick(this.user, this.userAttrs));
    }
  },
  created() {
    return this.resetForm();
  }
};
</script>

<style lang="scss" scoped>
.v-input {
  height: 72px;
}
</style>
