<template>
  <user-management
    :roles="roles"
    :users="users"
    :totalUsers="userCount">
  </user-management>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';

import UserManagement from './UserManagement';
import { getAdministrativeRoles } from '../../utils/users';

export default {
  name: 'settings',
  components: {
    UserManagement
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['users', 'userCount'], 'course'),
    roles() {
      return getAdministrativeRoles(this.user);
    }
  },
  methods: {
    ...mapActions(['fetchForCourse'], 'course')
  },
  created() {
    this.fetchForCourse();
  }
};
</script>
