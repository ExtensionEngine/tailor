<template>
  <user-management
    :courseKey="courseKey"
    :roles="roles"
    :users="filteredUsers"
    :totalUsers="totalUsers"
    :addUser="addUserToCourse"
    :changeRole="updateUserRole"
  >
  </user-management>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';

import UserManagement from '../common/UserManagement';
import { getAdministrativeRoles } from '../../utils/users';

export default {
  name: 'settings',
  components: {
    UserManagement
  },
  created() {
    this.listUser();
  },
  computed: {
    ...mapGetters(['filteredUsers', 'totalUsers', 'user'], 'users'),
    courseKey() {
      return String(this.$route.params.id);
    },
    roles() {
      return getAdministrativeRoles(this.user);
    }
  },
  methods: {
    ...mapActions(['addUserToCourse', 'listUser', 'updateUserRole'], 'users')
  }
};
</script>

<style lang="scss">

</style>
