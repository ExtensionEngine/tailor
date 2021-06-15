<template>
  <validation-observer
    ref="form"
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
        outlined
        class="required" />
    </validation-provider>
    <validation-provider
      v-slot="{ errors }"
      name="first name"
      rules="required|min:2|max:50|name_format">
      <v-text-field
        v-model="userData.firstName"
        :error-messages="errors"
        name="firstName"
        label="First name"
        outlined
        class="required" />
    </validation-provider>
    <validation-provider
      v-slot="{ errors }"
      name="last name"
      rules="required|min:2|max:50|name_format">
      <v-text-field
        v-model="userData.lastName"
        :error-messages="errors"
        name="lastName"
        label="Last name"
        outlined
        class="required" />
    </validation-provider>
    <validation-provider>
      <v-checkbox
        v-model="userData.notifications.assignment"
        label="Assignment notifications"
        color="primary darken-3"
        class="ma-0"
        hide-details />
    </validation-provider>
    <validation-provider>
      <v-checkbox
        v-model="userData.notifications.comment"
        label="Comment notifications"
        color="primary darken-3"
        hide-details />
    </validation-provider>
    <div class="d-flex justify-end">
      <v-btn @click="resetForm" :disabled="!hasChanges" text>
        Cancel
      </v-btn>
      <v-btn
        :disabled="!hasChanges"
        type="submit"
        color="primary darken-4"
        text>
        Update
      </v-btn>
    </div>
  </validation-observer>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

const ATTRIBUTES = ['firstName', 'lastName', 'email', 'notifications'];

const resetUser = () => ({
  firstName: null,
  lastName: null,
  email: null,
  notifications: {}
});

export default {
  name: 'user-info',
  data: () => ({ userData: resetUser() }),
  computed: {
    ...mapState({ user: state => state.auth.user }),
    hasChanges: vm => !isEqual(vm.userData, pick(vm.user, ATTRIBUTES))
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
      Object.assign(this.userData, cloneDeep(pick(this.user, ATTRIBUTES)));
      this.$refs.form.reset();
    }
  },
  mounted() {
    this.resetForm();
  }
};
</script>

<style lang="scss" scoped>
.v-input ::v-deep {
  label {
    margin-bottom: 0;
  }
}
</style>
