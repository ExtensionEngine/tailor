<template>
  <form @submit.prevent="addUser">
    <v-row align="center">
      <v-col cols="7" class="pr-2">
        <v-combobox
          v-model="email"
          v-validate="{ required: true, email: true }"
          @update:searchInput="fetchUsers"
          :error-messages="vErrors.collect('email')"
          :items="suggestedUsers"
          data-vv-name="email"
          label="Email" />
      </v-col>
      <v-col cols="3" class="px-4">
        <v-select
          v-model="role"
          v-validate="'required'"
          :error-messages="vErrors.collect('role')"
          :items="roles"
          data-vv-name="role" />
      </v-col>
      <v-col cols="2">
        <v-btn color="grey darken-3" type="submit" dark block>Add</v-btn>
      </v-col>
    </v-row>
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

<style lang="scss" scoped>
::v-deep .v-list.v-sheet {
  text-align: left;
}
</style>
