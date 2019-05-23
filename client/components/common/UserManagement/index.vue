<template>
  <v-card class="settings elevation-2">
    <progress-dialog :show="isLoading" :indeterminate="true"/>
    <add-user :roles="roles" :isLoading="isLoading" @upsert="upsert"/>
    <user-list
      v-bind="$attrs"
      :users="users"
      :roles="roles"
      @upsert="upsert"
      @remove="data => $emit('remove', data)"/>
  </v-card>
</template>

<script>
import AddUser from './AddUser';
import ProgressDialog from 'components/common/ProgressDialog';
import UserList from './UserList';

export default {
  inheritAttrs: false,
  props: {
    users: { type: Array, required: true },
    roles: { type: Array, required: true },
    isLoading: { type: Boolean, required: true }
  },
  methods: {
    upsert(...data) {
      return this.$emit('upsert', ...data);
    }
  },
  components: {
    AddUser,
    ProgressDialog,
    UserList
  }
};
</script>

<style lang="scss" scoped>
.settings {
  padding: 30px 30px 10px;
}
</style>
