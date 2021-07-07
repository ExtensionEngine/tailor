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
        <td class="text-left text-truncate">{{ item.fullName }}</td>
        <td class="role-select">
          <v-select
            @change="role => changeRole(item.email, role)"
            :value="item.repositoryRole"
            :items="roles"
            icon />
        </td>
        <td class="actions">
          <v-btn color="primary darken-2" icon small class="mb-2">
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
import loader from '@/components/common/loader';
import { mapRequests } from '@/plugins/radio';

const HEADERS = ['User', 'Email', 'Full Name', 'Role', ''];

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
      return HEADERS.map(text => ({ text, sortable: false }));
    }
  },
  methods: {
    ...mapActions('repository', ['getUsers', 'upsertUser', 'removeUser']),
    ...mapRequests('app', ['showConfirmationModal']),
    changeRole(email, role) {
      const { repositoryId } = this.$route.params;
      debounce(this.upsertUser, 500)({ repositoryId, email, role });
    },
    remove(user) {
      const { repositoryId } = this.$route.params;
      this.showConfirmationModal({
        title: 'Remove user',
        message: `Are you sure you want to remove user "${user.email}" from this repository?`,
        action: () => this.removeUser({ userId: user.id, repositoryId })
      });
    }
  },
  created: loader(function () {
    this.getUsers();
  }, 'isLoading')
};
</script>

<style lang="scss" scoped>
td.text-truncate {
  max-width: 11rem;
}

td.role-select {
  max-width: 7.5rem;
}

::v-deep .v-input__slot::before {
  border: none !important;
}

::v-deep .v-list.v-sheet {
  text-align: left;
}
</style>
