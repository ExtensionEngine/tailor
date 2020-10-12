<template>
  <div>
    <v-toolbar color="transparent" flat>
      <v-spacer />
      <v-btn
        @click.stop="showUserDialog()"
        color="blue-grey darken-4"
        text
        class="px-1">
        <v-icon class="pr-2">mdi-account-multiple-plus</v-icon>
        Add user
      </v-btn>
    </v-toolbar>
    <v-row no-gutters class="filters px-2 pb-2">
      <v-col>
        <v-switch
          v-model="showArchived"
          label="Archived"
          color="blue-grey darken-3"
          hide-details />
      </v-col>
      <v-col>
        <v-text-field
          v-model="filter"
          append-icon="mdi-magnify"
          label="Search"
          outlined hide-details clearable />
      </v-col>
    </v-row>
    <v-data-table
      v-show="!!totalItems"
      :headers="headers"
      :items="users"
      :server-items-length="totalItems"
      :options.sync="dataTable"
      :must-sort="true"
      :footer-props="{ itemsPerPageOptions: [10, 20, 50, 100] }"
      class="transparent">
      <template slot="item" slot-scope="{ item }">
        <tr :key="item.id">
          <td class="text-no-wrap text-left">
            <v-avatar size="40"><img :src="item.imgUrl"></v-avatar>
          </td>
          <td class="text-no-wrap text-left">{{ item.email }}</td>
          <td class="text-truncate text-left">{{ item.firstName || '/' }}</td>
          <td class="text-truncate text-left">{{ item.lastName || '/' }}</td>
          <td class="text-no-wrap text-left">{{ item.role }}</td>
          <td class="text-no-wrap text-left">
            {{ item.createdAt | formatDate('MM/DD/YY') }}
          </td>
          <td class="text-no-wrap text-center">
            <v-btn
              @click="showUserDialog(item)"
              color="blue-grey darken-3"
              small icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              @click="archiveOrRestore(item)"
              :disabled="user.id === item.id"
              color="blue-grey darken-3"
              small icon>
              <v-icon>
                mdi-account-{{ item.deletedAt ? 'convert' : 'off' }}
              </v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <user-dialog
      @updated="fetch(defaultPage)"
      @created="fetch(defaultPage)"
      :visible.sync="userDialog"
      :user-data="editedUser" />
  </div>
</template>

<script>
import api from '@/api/user';
import humanize from 'humanize-string';
import { mapRequests } from '@/plugins/radio';
import { mapState } from 'vuex';
import throttle from 'lodash/throttle';
import UserDialog from './UserDialog';

const defaultPage = () => ({
  sortBy: ['updatedAt'],
  sortDesc: [true],
  page: 1,
  itemsPerPage: 10
});

const headers = () => [
  { text: 'User', sortable: false },
  { text: 'Email', value: 'email' },
  { text: 'First Name', value: 'firstName' },
  { text: 'Last Name', value: 'lastName' },
  { text: 'Role', value: 'role' },
  { text: 'Date Created', value: 'createdAt' },
  { text: 'Actions', value: 'email', align: 'center', sortable: false }
];
const actions = {
  archive: user => api.remove(user),
  restore: user => api.upsert(user)
};

export default {
  name: 'user-list',
  data() {
    return {
      users: [],
      filter: null,
      dataTable: defaultPage(),
      totalItems: 0,
      userDialog: false,
      editedUser: null,
      showArchived: false,
      confirmation: null,
      loading: true
    };
  },
  computed: {
    ...mapState({ user: state => state.auth.user }),
    headers,
    defaultPage
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
    showUserDialog(user = null) {
      this.editedUser = user;
      this.userDialog = true;
    },
    fetch: throttle(async function (opts) {
      this.loading = true;
      Object.assign(this.dataTable, opts);
      const { items, total } = await api.fetch({
        sortBy: this.dataTable.sortBy[0],
        sortOrder: this.dataTable.sortDesc[0] ? 'DESC' : 'ASC',
        offset: (this.dataTable.page - 1) * this.dataTable.itemsPerPage,
        limit: this.dataTable.itemsPerPage,
        filter: this.filter,
        archived: this.showArchived || undefined
      });
      this.users = items;
      this.totalItems = total;
      this.loading = false;
    }, 400),
    archiveOrRestore(user) {
      const action = user.deletedAt ? 'restore' : 'archive';
      this.confirmation = {
        title: `${humanize(action)} user`,
        message: `Are you sure you want to ${action} user "${user.email}"?`,
        action: () => actions[action](user).then(() => this.fetch())
      };
      this.showConfirmationModal(this.confirmation);
    }
  },
  watch: {
    dataTable() {
      this.fetch();
    },
    filter() {
      this.fetch();
    },
    showArchived() {
      this.fetch();
    }
  },
  components: { UserDialog }
};
</script>

<style lang="scss" scoped>
.v-input--switch {
  ::v-deep {
    .v-label {
      margin-bottom: 0;
    }

    input[type=checkbox] {
      position: absolute;
    }
  }
}

.filters {
  margin: 0 1.125rem 0.5rem;
}

td.text-truncate {
  max-width: 7.25rem;
}
</style>
