<template>
  <v-container>
    <v-layout>
      <v-flex>
        <user-management
          :users="users"
          :roles="roles"
          :isLoading="isLoading"
          @upsert="upsert"
          @remove="remove"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '@/api/system';
import map from 'lodash/map';
import omit from 'lodash/omit';
import { role } from 'shared';
import { title as titleCase } from 'to-case';
import UserManagement from 'components/common/UserManagement';

export default {
  data() {
    return {
      isLoading: true,
      users: []
    };
  },
  computed: {
    roles() {
      const { user: roles } = role;
      const userRoles = omit(roles, role.user.INTEGRATION);
      return map(userRoles, value => ({ text: titleCase(value), value }));
    }
  },
  methods: {
    upsert(email, role) {
      this.isLoading = true;
      return api.upsertUser(email, { role }).then(userData => {
        this.isLoading = false;
        const user = this.users.find(it => it.id === userData.id);
        return user ? Object.assign(user, userData) : this.users.unshift(userData);
      });
    },
    remove({ id }) {
      this.isLoading = true;
      api.removeUser(id).then(() => {
        this.isLoading = false;
        this.users = this.users.filter(user => user.id !== id);
      });
    }
  },
  created() {
    api.getUsers().then(users => Object.assign(this, { users, isLoading: false }));
  },
  components: {
    UserManagement
  }
};
</script>
