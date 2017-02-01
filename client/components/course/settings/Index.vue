<template>
  <div class="settings">
    <div class="row">
      <div class="col-md-10">
        <add-user :roles="roles"></add-user>
      </div>
    </div>
    <cube-spinner v-if="showLoader"></cube-spinner>
    <user-list v-else-if="hasUsers" :users="users" :roles="roles"></user-list>
    <div v-else class="well">There are no users assigned with this course.</div>
  </div>
</template>

<script>
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import Promise from 'bluebird';
import { role } from 'shared';
import toTitleCase from 'to-title-case';

import AddUser from './AddUser';
import CubeSpinner from '../../loaders/CubeSpinner';
import UserList from './UserList';

export default {
  data() {
    return {
      showLoader: true
    };
  },
  computed: {
    ...mapGetters(['users'], 'editor'),
    hasUsers() {
      return !!this.users.length;
    },
    roles() {
      return map(role.course, it => ({ title: toTitleCase(it), value: it }));
    }
  },
  methods: {
    ...mapActions(['getUsers'], 'editor'),
    fetchUsers() {
      this.showLoader = true;
      const request = Promise.join(this.getUsers(), Promise.delay(500));
      return request.then(() => (this.showLoader = false));
    }
  },
  created() {
    this.fetchUsers();
  },
  components: {
    AddUser,
    CubeSpinner,
    UserList
  }
};
</script>

<style lang="scss" scoped>
.settings {
  margin: 40px 20px;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
}
</style>
