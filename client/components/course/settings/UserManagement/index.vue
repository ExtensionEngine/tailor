<template>
  <div class="settings">
    <div class="row">
      <div class="col-md-10">
        <add-user :roles="roles"></add-user>
      </div>
    </div>
    <loader v-if="showLoader"></loader>
    <user-list v-else-if="hasUsers" :users="users" :roles="roles"></user-list>
    <div v-else class="well">There are no users assigned with this course.</div>
  </div>
</template>

<script>
import AddUser from './AddUser';
import Loader from '../../../common/Loader';
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import Promise from 'bluebird';
import { role } from 'shared';
import toTitleCase from 'to-title-case';
import UserList from './UserList';
export default {
  data() {
    return {
      showLoader: true
    };
  },
  computed: {
    ...mapGetters(['users'], 'course'),
    hasUsers() {
      return !!this.users.length;
    },
    roles() {
      return map(role.course, it => ({ title: toTitleCase(it), value: it }));
    }
  },
  methods: {
    ...mapActions(['getUsers'], 'course'),
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
    Loader,
    UserList
  }
};
</script>

<style lang="scss" scoped>
.settings {
  padding: 30px 30px 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  background-color: white;
}

.loader {
  margin: 20px 0;
}
</style>
