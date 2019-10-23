<template>
  <v-card class="settings elevation-2">
    <add-user :roles="roles" />
    <user-list :roles="roles" />
  </v-card>
</template>

<script>
import AddUser from './AddUser';
import map from 'lodash/map';
import { role } from 'shared';
import { title as titleCase } from 'to-case';
import UserList from './UserList';

export default {
  computed: {
    roles() {
      return map(role.repository, it => ({
        text: titleCase(it.replace('REPOSITORY', '')),
        value: it
      }));
    }
  },
  components: {
    AddUser,
    UserList
  }
};
</script>

<style lang="scss" scoped>
.settings {
  padding: 30px 30px 10px;
}
</style>
