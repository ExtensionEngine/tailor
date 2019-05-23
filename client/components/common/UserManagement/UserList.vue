<template>
  <v-data-table
    :headers="headers"
    :items="users"
    no-data-text="No assigned users."
    hide-actions>
    <template v-slot:items="{ item }">
      <td class="text-xs-left">
        <v-avatar color="blue lighten-1" size="40" dark class="mr-3">
          <span class="headline white--text">
            {{ item.email[0].toUpperCase() }}
          </span>
        </v-avatar>
        {{ item.email }}
      </td>
      <td class="role-select">
        <v-select
          :value="item[roleType]"
          :items="roles"
          @change="role => upsert(item.email, role)"
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
import EventBus from 'EventBus';
import debounce from 'lodash/debounce';

const appChannel = EventBus.channel('app');

export default {
  props: {
    users: { type: Array, required: true },
    roles: { type: Array, required: true },
    roleType: { type: String, default: 'role' }
  },
  computed: {
    headers() {
      return ['User', 'Role', ''].map(text => ({ text, sortable: false }));
    }
  },
  methods: {
    upsert: debounce(function (email, role) {
      this.$emit('upsert', email, role);
    }, 500),
    remove(item) {
      appChannel.emit('showConfirmationModal', {
        title: `Remove user?`,
        message: `Are you sure you want to remove ${item.email}?`,
        action: () => this.$emit('remove', item)
      });
    }
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
