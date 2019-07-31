<template>
  <v-form @submit.prevent="updateUser">
    <v-layout column pt-2 px-4 mx-3>
      <v-text-field
        v-model="email"
        v-validate="'required|email'"
        :error-messages="vErrors.collect('email')"
        data-vv-as="Email"
        data-vv-name="email"
        name="email"
        label="Email" />
      <v-text-field
        v-model="firstName"
        v-validate="'required|min:2|max:20'"
        :error-messages="vErrors.collect('firstName')"
        data-vv-as="First name"
        data-vv-name="firstName"
        label="First name" />
      <v-text-field
        v-model="lastName"
        v-validate="'required|min:2|max:20'"
        :error-messages="vErrors.collect('lastName')"
        data-vv-as="Last Name"
        data-vv-name="lastName"
        label="Last name" />
    </v-layout>
    <v-layout pb-3 px-4 mx-2>
      <v-spacer />
      <v-btn
        @click="resetUser"
        :disabled="!hasChanges && !vErrors.any()"
        flat
        color="primary">
        Cancel
      </v-btn>
      <v-btn
        :disabled="!hasChanges || !isValid"
        outline
        color="primary"
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

const defaultData = () => ({
  firstName: null,
  lastName: null,
  email: null
});

export default {
  name: 'user-info',
  mixins: [withValidation()],
  data: () => defaultData(),
  computed: {
    ...mapState({ user: state => state.auth.user }),
    userAttrs: () => ATTRIBUTES,
    hasChanges() {
      return Object.keys(this.vFields).some(key => this.vFields[key].changed);
    },
    isValid() {
      return Object.keys(this.vFields).every(key => this.vFields[key].valid);
    }
  },
  methods: {
    ...mapActions(['updateInfo']),
    updateUser() {
      return this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        return this.updateInfo(pick(this, this.userAttrs))
          .then(() => {
            this.$snackbar.show('User information updated!');
            return this.resetUser();
          })
          .catch(() => this.$snackbar.error('Email already exists!'));
      });
    },
    resetUser() {
      this.$validator.reset();
      return Object.assign(this, pick(this.user, this.userAttrs));
    }
  },
  created() {
    return this.resetUser();
  }
};
</script>

<style lang="scss" scoped>
.v-input {
  height: 72px;
}
</style>
