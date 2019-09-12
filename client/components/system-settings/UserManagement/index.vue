<template>
  <v-layout justify-center class="elevation-1 white">
    <v-flex>
      <v-toolbar color="white" flat>
        <v-spacer />
        <v-btn @click.stop="showUserDialog()" color="primary darken-1" outline>
          <v-icon class="pr-2">mdi-account-plus-outline</v-icon>
          Add user
        </v-btn>
      </v-toolbar>
      <div>
        <v-layout row class="filters">
          <v-flex>
            <v-switch
              v-model="showArchived"
              label="Archived"
              color="primary"
              hide-details />
          </v-flex>
          <v-flex>
            <v-text-field
              v-model="filter"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              clearable />
          </v-flex>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="users"
          :total-items="totalItems"
          :pagination.sync="dataTable"
          :must-sort="true"
          :loading="loading"
          :rows-per-page-items="[10, 20, 50, 100]">
          <template slot="items" slot-scope="{ item }">
            <tr :key="item.id">
              <td class="no-wrap text-xs-left">{{ item.email }}</td>
              <td class="no-wrap text-xs-left">{{ item.role }}</td>
              <td class="no-wrap text-xs-left">{{ item.createdAt | formatDate }}</td>
              <td class="no-wrap text-xs-center">
                <v-btn
                  @click="showUserDialog(item)"
                  color="primary"
                  small
                  flat
                  icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  @click="archiveOrRestore(item)"
                  :disabled="user.id === item.id"
                  color="primary"
                  small
                  flat
                  icon>
                  <v-icon>
                    mdi-account-{{ item.deletedAt ? 'convert' : 'off' }}
                  </v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <user-dialog
        @updated="fetch(defaultPage)"
        @created="fetch(defaultPage)"
        :visible.sync="userDialog"
        :user-data="editedUser" />
    </v-flex>
  </v-layout>
</template>

<script>
import api from '@/api/user';
import EventBus from 'EventBus';
import humanize from 'humanize-string';
import { mapState } from 'vuex';
import throttle from 'lodash/throttle';
import UserDialog from './UserDialog';

const appChannel = EventBus.channel('app');

const defaultPage = () => ({
  sortBy: 'updatedAt',
  descending: true,
  page: 1,
  rowsPerPage: 10
});

const headers = () => [
  { text: 'Email', value: 'email' },
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
    showUserDialog(user = null) {
      this.editedUser = user;
      this.userDialog = true;
    },
    fetch: throttle(async function (opts) {
      this.loading = true;
      Object.assign(this.dataTable, opts);
      const { items, total } = await api.fetch({
        sortBy: this.dataTable.sortBy,
        sortOrder: this.dataTable.descending ? 'DESC' : 'ASC',
        offset: (this.dataTable.page - 1) * this.dataTable.rowsPerPage,
        limit: this.dataTable.rowsPerPage,
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
      appChannel.emit('showConfirmationModal', this.confirmation);
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
  /deep/ {
    .v-label {
      margin-bottom: 0;
    }

    input[type=checkbox] {
      position: absolute;
    }
  }
}

.filters {
  margin: 0 18px 8px;
}
</style>
