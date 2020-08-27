<template>
  <validation-observer
    ref="form"
    v-slot="{ invalid }"
    @submit.prevent="$refs.form.handleSubmit(submit)"
    tag="form"
    novalidate
    class="pt-4 px-4">
    <validation-provider
      v-slot="{ errors }"
      name="email"
      :rules="{ required: true, email: true, unique_email: { userData: user } }">
      <v-text-field
        v-model="userData.email"
        :error-messages="errors"
        name="email"
        label="Email"
        outlined />
    </validation-provider>
    <validation-provider
      v-slot="{ errors }"
      name="first name"
      rules="required|min:2|max:20">
      <v-text-field
        v-model="userData.firstName"
        :error-messages="errors"
        name="firstName"
        label="First name"
        outlined />
    </validation-provider>
    <validation-provider
      v-slot="{ errors }"
      name="last name"
      rules="required|min:2|max:20">
      <v-text-field
        v-model="userData.lastName"
        :error-messages="errors"
        name="lastName"
        label="Last name"
        outlined />
    </validation-provider>
    <div class="d-flex justify-end">
      <v-btn @click="resetForm" :disabled="!hasChanges" text>
        Cancel
      </v-btn>
      <v-btn :disabled="invalid || !hasChanges" type="submit" text>
        Update
      </v-btn>
    </div>
  </validation-observer>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import pick from 'lodash/pick';

const ATTRIBUTES = ['firstName', 'lastName', 'email'];

const resetUser = () => ({
  firstName: null,
  lastName: null,
  email: null
});

export default {
  name: 'user-info',
  data: () => ({ userData: resetUser() }),
  computed: {
    ...mapState({ user: state => state.auth.user }),
    hasChanges: vm => ATTRIBUTES.some(key => vm.userData[key] !== vm.user[key])
  },
  methods: {
    ...mapActions(['updateInfo']),
    submit() {
      return this.updateInfo(pick(this.userData, ATTRIBUTES))
        .then(() => {
          this.$snackbar.show('User information updated!');
          return this.resetForm();
        })
        .catch(() => this.$snackbar.error('Something went wrong!'));
    },
    resetForm() {
      Object.assign(this.userData, pick(this.user, ATTRIBUTES));
      this.$refs.form.reset();
    }
  },
  mounted() {
    return this.resetForm();
  }
};
</script>
