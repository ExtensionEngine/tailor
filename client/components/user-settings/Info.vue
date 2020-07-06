<template>
  <validation-observer v-slot="{ invalid, handleSubmit }" slim>
    <v-form @submit.prevent="handleSubmit(updateUser)" class="pt-4 px-4">
      <validation-provider
        v-slot="{ errors }"
        mode="eager"
        :rules="{ required: true, email: true, unique_email: { userData: user } }"
        name="email">
        <v-text-field
          v-model="userData.email"
          :error-messages="errors"
          name="email"
          label="Email"
          outlined />
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        mode="eager"
        rules="required|min:2|max:20"
        name="firstName">
        <v-text-field
          v-model="userData.firstName"
          :error-messages="errors"
          data-vv-as="First name"
          data-vv-name="firstName"
          label="First name"
          outlined />
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        mode="eager"
        rules="required|min:2|max:20"
        name="lastName">
        <v-text-field
          v-model="userData.lastName"
          :error-messages="errors"
          data-vv-as="Last Name"
          data-vv-name="lastName"
          label="Last name"
          outlined />
      </validation-provider>
      <div>
        <div class="float-right">
          <v-btn
            @click="resetForm"
            :disabled="!hasChanges && !invalid"
            text>
            Cancel
          </v-btn>
          <v-btn
            :disabled="!hasChanges || invalid"
            type="submit"
            color="blue-grey darken-4"
            text>
            Update
          </v-btn>
        </div>
      </div>
    </v-form>
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
    async updateUser() {
      return this.updateInfo(pick(this.userData, ATTRIBUTES))
        .then(() => {
          this.$snackbar.show('User information updated!');
          return this.resetForm();
        })
        .catch(() => this.$snackbar.error('Something went wrong!'));
    },
    resetForm() {
      return Object.assign(this.userData, pick(this.user, ATTRIBUTES));
    }
  },
  created() {
    return this.resetForm();
  }
};
</script>
