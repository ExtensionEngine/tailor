<template>
  <form @submit.prevent="addUser">
    <v-layout row align-center class="pl-3">
      <v-flex xs7 class="pr-2">
        <v-combobox
          v-model="email"
          v-validate="{ required: true, email: true }"
          @update:searchInput="fetchUsers"
          :error-messages="vErrors.collect('email')"
          :items="suggestedUsers"
          data-vv-name="email"
          label="Email" />
      </v-flex>
      <v-flex xs3 class="px-4">
        <v-select
          v-model="role"
          v-validate="'required'"
          :error-messages="vErrors.collect('role')"
          :items="roles"
          data-vv-name="role"
          flat />
      </v-flex>
      <v-flex xs2>
        <v-btn type="submit" small outline>Add</v-btn>
      </v-flex>
    </v-layout>
  </form>
</template>

<script>
import api from '@/api/user';
import { mapActions } from 'vuex';
import throttle from 'lodash/throttle';
import { withValidation } from 'utils/validation';

export default {
  mixins: [withValidation()],
  props: {
    roles: { type: Array, required: true }
  },
  data() {
    return {
      email: '',
      suggestedUsers: [],
      role: this.roles[0].value
    };
  },
  methods: {
    ...mapActions('course', ['upsertUser']),
    addUser() {
      const { email, role } = this;
      const { courseId } = this.$route.params;
      this.$validator.validateAll().then(async isValid => {
        if (!isValid) return;
        await this.upsertUser({ courseId, email, role });
        this.email = '';
        this.suggestedUsers = [];
        this.$nextTick(() => this.$validator.reset());
      });
    },
    fetchUsers: throttle(function (filter) {
      if (filter && filter.length > 1) {
        return api.fetch({ filter }).then(({ items }) => {
          this.suggestedUsers = items.map(it => it.email);
        });
      }
      this.suggestedUsers = [];
    }, 350)
  }
};
</script>
