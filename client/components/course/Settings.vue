<template>
  <user-management
    :courseKey="courseKey"
    :roles="roles"
    :users="users"
    :addUser="addUserToCourse"
    :changeRole="updateUserRole"
  >
  </user-management>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';

import Permissions from '../../utils/perms';
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
    courseKey() {
      return this.$route.params.id;
    },
    roles() {
      return getRolesForUser(this.user);
    }
  },

  methods: {
    ...mapActions(['addUserToCourse', 'listUser', 'updateUserRole'], 'users')
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!Permissions.isGlobalOrCourseAdmin(vm.user)) {
        return next({ name: 'course', params: { id: vm.courseKey } });
      }
      return next(to.path);
    });
  }
};
</script>

<style lang="scss">

</style>
