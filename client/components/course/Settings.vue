<template>
  <user-management
    :roles="roles"
    :users="users"
    :addUser="addUser"
    :changeRole="updateUserRole"
  >
  </user-management>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';

import UserManagement from '../common/UserManagement';
import { getRolesForUser } from '../../utils/users';

export default {
  name: 'course-settings',

  components: {
    UserManagement
  },

  created() {
    this.listUser();
  },

  computed: {
    ...mapGetters(['user', 'users'], 'users'),
    roles() {
      return getRolesForUser(this.user);
    }
  },

  methods: {
    ...mapActions(['addUser', 'listUser', 'updateUserRole'], 'users')
  }
};
</script>

<style lang="scss">

</style>
