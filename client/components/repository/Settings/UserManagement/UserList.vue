<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :loading="isLoading"
    no-data-text="No assigned users."
    hide-actions>
    <template v-slot:items="{ item }">
      <td class="text-xs-left">
        <v-avatar color="primary lighten-2" size="40" dark class="mr-3">
          <span class="headline white--text">
            {{ item.email[0].toUpperCase() }}
          </span>
        </v-avatar>
        {{ item.email }}
      </td>
      <td class="role-select">
        <v-select
          @change="role => changeRole(item.email, role)"
          :value="item.repositoryRole"
          :items="roles"
          icon />
      </td>
      <td class="actions">
        <v-btn color="primary" icon flat small>
          <v-icon @click="remove(item)">mdi-delete</v-icon>
        </v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import debounce from 'lodash/debounce';

export default {
  props: {
    roles: { type: Array, required: true }
  },
  data() {
    return { isLoading: true };
  },
  computed: {
    ...mapGetters('repository', ['users']),
    headers() {
      return ['User', 'Role', ''].map(text => ({ text, sortable: false }));
    }
  },
  methods: {
    ...mapActions('repository', ['getUsers', 'upsertUser', 'removeUser']),
    fetchUsers() {
      this.isLoading = true;
      return this.getUsers().then(() => (this.isLoading = false));
    },
    changeRole(email, role) {
      const { repositoryId } = this.$route.params;
      debounce(this.upsertUser, 500)({ repositoryId, email, role });
    },
    remove(user) {
      const { repositoryId } = this.$route.params;
      this.removeUser({ userId: user.id, repositoryId });
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
