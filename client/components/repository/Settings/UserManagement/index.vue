<template>
  <div>
    <div class="d-flex">
      <v-spacer />
      <add-user-dialog :roles="roles" />
    </div>
    <user-list :roles="roles" />
  </div>
</template>

<script>
import AddUserDialog from './AddUserDialog.vue';
import map from 'lodash/map';
import { role } from 'shared';
import { title as titleCase } from 'to-case';
import UserList from './UserList.vue';

export default {
  name: 'repository-user-management',
  computed: {
    isExternalAccessManagement: () => process.env.EXTERNAL_ACCESS_MANAGEMENT,
    roles: () => map(role.repository, value => ({ text: titleCase(value), value }))
  },
  created() {
    if (this.isExternalAccessManagement) this.$router.go(-1);
  },
  components: {
    AddUserDialog,
    UserList
  }
};
</script>
