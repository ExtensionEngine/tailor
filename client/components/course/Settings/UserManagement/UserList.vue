<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :loading="isLoading"
    no-data-text="No assigned users."
    hide-actions>
    <template v-slot:items="{ item }">
      <td class="text-xs-left">
        <v-avatar color="blue lighten-1" size="40" dark class="mr-3">
          <img :src="item.imgUrl"/>
        </v-avatar>
        {{ item.email }}
      </td>
      <td class="role-select">
        <v-select
          :value="item.courseRole"
          :items="roles"
          @change="role => changeRole(item.email, role)"
          icon/>
      </td>
      <td class="actions">
        <v-btn color="blue-grey" icon flat small>
          <v-icon @click="remove(item)">mdi-delete</v-icon>
        </v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import debounce from 'lodash/debounce';

export default {
  props: {
    roles: { type: Array, required: true }
  },
  data() {
    return { isLoading: true };
  },
  computed: {
    ...mapGetters(['users'], 'course'),
    headers() {
      return ['User', 'Role', ''].map(text => ({ text, sortable: false }));
    }
  },
  methods: {
    ...mapActions(['getUsers', 'upsertUser', 'removeUser'], 'course'),
    fetchUsers() {
      this.isLoading = true;
      return this.getUsers().then(() => (this.isLoading = false));
    },
    changeRole(email, role) {
      const { courseId } = this.$route.params;
      debounce(this.upsertUser, 500)({ courseId, email, role });
    },
    remove(user) {
      const { courseId } = this.$route.params;
      this.removeUser({ userId: user.id, courseId });
    }
  },
  created() {
    this.fetchUsers();
  }
};
</script>

<style lang="scss" scoped>
.role-select {
  max-width: 26px;
}

.v-table .actions {
  max-width: 15px;
  padding: 0 0 6px 0;
}

/deep/ .v-input__slot::before {
  border: none !important;
}
</style>
