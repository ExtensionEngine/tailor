<template>
  <div>
    <add-user :roles="roles" />
    <user-list :roles="roles" />
  </div>
</template>

<script>
import AddUser from './AddUser';
import map from 'lodash/map';
import { role } from 'shared';
import { title as titleCase } from 'to-case';
import UserList from './UserList';

export default {
  computed: {
    roles: () => map(role.repository, value => ({ text: titleCase(value), value }))
  },
  components: {
    AddUser,
    UserList
  }
};
</script>
