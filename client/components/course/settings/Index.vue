<template>
  <div class="settings">
    <div class="row">
      <div class="col-md-10">
        <user-invite :roles="roles"></user-invite>
      </div>
    </div>
    <cube-spinner v-if="showLoader"></cube-spinner>
    <user-list v-else-if="hasUsers" :roles="roles" :users="users"></user-list>
    <div v-else class="well">There are no users assigned with this course.</div>
  </div>
</template>

<script>
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import Promise from 'bluebird';
import { role } from 'shared';
import toTitleCase from 'to-title-case';

import CubeSpinner from '../../loaders/CubeSpinner';
import UserInvite from './UserInvite';
import UserList from './UserList';

export default {
  data() {
    return {
      showLoader: true
    };
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['users'], 'editor'),
    hasUsers() {
      return !!this.users.length;
    },
    roles() {
      return map(role.course, it => ({ title: toTitleCase(it), value: it }));
    }
  },
  methods: {
    ...mapActions(['fetch'], 'users'),
    fetchUsers() {
      this.showLoader = true;
      const request = Promise.join(this.fetch(), Promise.delay(500));
      return request.then(() => (this.showLoader = false));
    }
  },
  created() {
    this.fetchUsers();
  },
  components: {
    CubeSpinner,
    UserInvite,
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
