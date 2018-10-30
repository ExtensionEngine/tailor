<template>
  <div class="system-users-container">
    <h2>System user management</h2>
    <loader v-if="showLoader"></loader>
    <div v-else class="system-users">
      <add-system-user v-bind="{ defaultRole, roles }" @add="upsertUser"/>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>User</th>
            <th class="role-column">Role</th>
            <th class="text-center remove-column">Remove from system</th>
          </tr>
        </thead>
        <tbody>
          <system-user
            v-for="{ id, email, role } in users"
            v-bind="{ id, email, role, roles }"
            :key="id"
            @update="data => upsertUser(email, data)"
            @delete="removeUser(id)">
          </system-user>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getUsers, upsertUser, removeUser } from '../../api/system';
import { role } from 'shared';
import AddSystemUser from './AddSystemUser';
import Loader from '../common/Loader';
import omit from 'lodash/omit';
import SystemUser from './SystemUser';

export default {
  name: 'system-user-management',
  data() {
    return {
      showLoader: true,
      users: []
    };
  },
  computed: {
    defaultRole() {
      return role.user.USER;
    },
    roles() {
      return Object.values(omit(role.user, role.user.INTEGRATION));
    }
  },
  methods: {
    upsertUser(email, data) {
      return upsertUser(email, data).then(userData => {
        let user = this.users.find(it => it.email === email);
        return user ? Object.assign(user, userData) : this.users.unshift(userData);
      });
    },
    removeUser(id) {
      return removeUser(id).then(() => {
        this.users = this.users.filter(user => user.id !== id);
      });
    }
  },
  created() {
    getUsers().then(users => Object.assign(this, { users, showLoader: false }));
  },
  components: {
    AddSystemUser,
    Loader,
    SystemUser
  }
};
</script>

<style lang="scss" scoped>
.system-users-container {
  padding: 60px 60px 20px;
}

h2 {
  margin: 0 0 20px;
  padding: 0;
  color: #444;
  font-size: 18px;
  text-align: left;
}

.system-users {
  padding: 30px 30px 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  background-color: white;

  .table {
    margin-top: 30px;
    text-align: left;
  }
}

.role-column, .remove-column {
  width: 300px;
}
</style>
