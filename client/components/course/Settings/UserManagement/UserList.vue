<template>
  <v-data-table
    v-if="!isLoading"
    :headers="headers"
    :items="users"
    no-data-text="No assigned users."
    hide-default-footer
    class="grey lighten-4">
    <template v-slot:item="{ item }">
      <tr>
        <td class="text-left">
          <v-avatar size="40">
            <img :src="item.imgUrl">
          </v-avatar>
        </td>
        <td class="text-left">{{ item.email }}</td>
        <td class="text-left">{{ item.firstName || '/' }}</td>
        <td class="text-left">{{ item.lastName || '/' }}</td>
        <td class="role-select">
          <v-select
            @change="role => changeRole(item.email, role)"
            :value="item.repositoryRole"
            :items="roles"
            icon />
        </td>
        <td class="actions">
          <v-btn color="primary" icon class="pb-2">
            <v-icon @click="remove(item)">mdi-delete</v-icon>
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import debounce from 'lodash/debounce';

const HEADERS = ['User', 'Email', 'First Name', 'Last Name', 'Role', ''];

export default {
  props: {
    roles: { type: Array, required: true }
  },
  data() {
    return { isLoading: true };
  },
  computed: {
    ...mapGetters('course', ['users']),
    headers() {
      return HEADERS.map(text => ({ text, sortable: false }));
    }
  },
  methods: {
    ...mapActions('course', ['getUsers', 'upsertUser', 'removeUser']),
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
  max-width: 120px;
}

.v-table .actions {
  max-width: 15px;
}

::v-deep .v-input__slot::before {
  border: none !important;
}

::v-deep .v-list.v-sheet {
  text-align: left;
}
</style>
