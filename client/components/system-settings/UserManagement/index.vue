<template>
  <v-layout justify-center class="elevation-1 white">
    <v-flex class="mt-1">
      <v-toolbar color="white" flat>
        <v-spacer/>
        <v-btn @click.stop="showUserDialog()" color="primary" outline>
          Add user
        </v-btn>
      </v-toolbar>
      <div>
        <v-layout column align-end class="px-4 table-toolbar">
          <v-flex lg4>
            <v-text-field
              v-model="filter"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              clearable/>
          </v-flex>
          <v-flex lg4 class="my-1">
            <v-checkbox
              v-model="showArchived"
              label="Show archived"
              class="archived-checkbox"
              hide-details/>
          </v-flex>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="users"
          :total-items="totalItems"
          :pagination.sync="dataTable"
          :must-sort="true">
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
                  :disabled="user.id === item.id"
                  @click="archiveOrRestore(item)"
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
        :visible.sync="userDialog"
        :userData="editedUser"
        @updated="fetch(defaultPage)"
        @created="fetch(defaultPage)"/>
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

const defaultPage = () => ({ sortBy: 'updatedAt', descending: true, page: 1 });
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
      confirmation: null
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
.user-table /deep/ .v-input--checkbox {
  justify-content: center;
}

.archived-checkbox /deep/ .v-input__slot {
  flex-direction: row-reverse;

  .v-input--selection-controls__input {
    justify-content: center;
    margin-right: 0;
  }

  .v-icon {
    font-size: 18px;
  }

  label {
    margin: 0 2px 0 0;
    font-size: 14px;
  }
}
</style>
