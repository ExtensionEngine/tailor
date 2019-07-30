<template>
  <v-form @submit.prevent="updateUser">
    <v-layout column pt-3 px-4 mx-3>
      <v-text-field
        v-model="context.email"
        v-validate="{ required: true, email: true }"
        :error-messages="vErrors.collect('email')"
        data-vv-as="Email"
        data-vv-name="email"
        name="email"
        label="Email" />
      <v-text-field
        v-model="context.firstName"
        v-validate="{ max: 20 }"
        :error-messages="vErrors.collect('firstName')"
        data-vv-as="First name"
        data-vv-name="firstName"
        label="First name" />
      <v-text-field
        v-model="context.lastName"
        v-validate="{ max: 20 }"
        :error-messages="vErrors.collect('lastName')"
        data-vv-as="Last Name"
        data-vv-name="lastName"
        label="Last name" />
    </v-layout>
    <v-layout px-4 mx-2>
      <v-spacer />
      <v-btn
        @click="resetUser"
        :disabled="!hasChanges"
        flat
        color="secondary">
        Cancel
      </v-btn>
      <v-btn
        :disabled="!hasChanges"
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

const snackOpts = { right: true };

const ATTRIBUTES = ['firstName', 'lastName', 'email'];

const defaultData = () => ({
  firstName: null,
  lastName: null,
  email: null
});

export default {
  name: 'user-info',
  mixins: [withValidation()],
  data: () => ({ context: defaultData() }),
  computed: {
    ...mapState({ user: state => state.auth.user }),
    hasChanges() {
      return Object.keys(this.vFields).some(name => this.vFields[name].changed);
    },
    contextAttrs: () => ATTRIBUTES
  },
  methods: {
    ...mapActions(['updateInfo']),
    updateUser() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return this.$snackbar.error('Validation failed!', snackOpts);
        return this.updateInfo(pick(this.context, this.contextAttrs))
          .then(() => {
            this.$snackbar.success('User information updated!', snackOpts);
          });
      })
      .catch(() => this.$snackbar.error('Email already exists!', snackOpts));
    },
    resetUser() {
      this.$validator.reset();
      this.context = pick(this.user, this.contextAttrs);
    }
  },
  created() {
    this.resetUser();
  }
};
</script>

<style lang="scss" scoped>
.v-input {
  height: 72px;
}
</style>
