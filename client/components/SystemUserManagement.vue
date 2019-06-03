<template>
  <div class="grey lighten-2 user-management-container">
    <v-container>
      <v-layout>
        <v-flex>
          <user-management
            :users="users"
            :roles="roles"
            :isRequesting="isRequesting"
            @upsert="upsert"
            @remove="remove"/>
        </v-flex>
      </v-layout>
      <app-footer/>
    </v-container>
  </div>
</template>

<script>
import api from '@/api/system';
import AppFooter from '@/components/common/Footer';
import map from 'lodash/map';
import omit from 'lodash/omit';
import { role } from 'shared';
import { title as titleCase } from 'to-case';
import UserManagement from 'components/common/UserManagement';

export default {
  data() {
    return {
      isRequesting: true,
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
      this.isRequesting = true;
      api.upsertUser(email, { role }).then(userData => {
        this.isRequesting = false;
        const user = this.users.find(it => it.id === userData.id);
        return user ? Object.assign(user, userData) : this.users.unshift(userData);
      });
    },
    remove({ id }) {
      this.isRequesting = true;
      api.removeUser(id).then(() => {
        this.isRequesting = false;
        this.users = this.users.filter(user => user.id !== id);
      });
    }
  },
  created() {
    api.getUsers().then(users => Object.assign(this, { users, isRequesting: false }));
  },
  components: {
    AppFooter,
    UserManagement
  }
};
</script>

<style lang="scss" scoped>
.user-management-container {
  padding-bottom: 75px;
}
</style>
