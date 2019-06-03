<template>
  <form @submit.prevent="addUser">
    <v-layout row align-center class="pl-3">
      <v-flex xs7 class="pr-2">
        <v-text-field
          v-validate="{ required: true, email: true }"
          v-model="email"
          :error-messages="vErrors.collect('email')"
          data-vv-name="email"
          label="Email"/>
      </v-flex>
      <v-flex xs3 class="px-4">
        <v-select
          v-validate="'required'"
          v-model="role"
          :error-messages="vErrors.collect('role')"
          :items="roles"
          data-vv-name="role"
          flat/>
      </v-flex>
      <v-flex xs2>
        <v-btn
          :loading="isLoading"
          type="submit"
          color="blue-grey darken-1"
          small
          dark>
          Add
        </v-btn>
      </v-flex>
    </v-layout>
  </form>
</template>

<script>
import { withValidation } from 'utils/validation';

export default {
  mixins: [withValidation()],
  props: {
    roles: { type: Array, required: true },
    isLoading: { type: Boolean, required: true }
  },
  data() {
    return {
      email: '',
      role: this.roles[0].value
    };
  },
  methods: {
    addUser() {
      const { email, role } = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) this.$emit('upsert', email, role);
      });
    }
  },
  watch: {
    isLoading(val) {
      if (val) return;
      this.email = '';
      this.$nextTick(() => this.$validator.reset());
    }
  }
};
</script>
