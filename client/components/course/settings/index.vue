<template>
  <div class="main-container">
    <div class="list-group table-of-contents">
      <a
        class="list-group-item"
        @click="detailsSelected = true"
        :class="{ selected: detailsSelected }">
        <span class="mdi mdi-wrench"></span>
        General
      </a>
      <a
        class="list-group-item"
        @click="detailsSelected = false"
        :class="{ selected: !detailsSelected }">
        <span class="mdi mdi-account"></span>
        User management
      </a>
    </div>
    <course-details v-if="detailsSelected"></course-details>
    <div v-else class="settings">
      <div class="row">
        <div class="col-md-10">
          <add-user :roles="roles"></add-user>
        </div>
      </div>
      <loader v-if="showLoader"></loader>
      <user-list v-else-if="hasUsers" :users="users" :roles="roles"></user-list>
      <div v-else class="well">There are no users assigned with this course.</div>
    </div>
  </div>
</template>

<script>
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import Promise from 'bluebird';
import { role } from 'shared';
import toTitleCase from 'to-title-case';

import AddUser from './AddUser';
import Loader from '../../common/Loader';
import UserList from './UserList';
import CourseDetails from '../CourseDetails';

export default {
  data() {
    return {
      showLoader: true,
      detailsSelected: false
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
    UserList,
    CourseDetails
  }
};
</script>

<style lang="scss" scoped>
.list-group {
  line-height: 32px;
  display: inline-block;
  float: left;
  margin: 75px 10px 0 60px;
  width: 19%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  padding: 10px 10px 350px 10px;
  background-color: white;

  .list-group-item {
    padding: 10px 0;
    margin-bottom: 1px;
    border: 0px;
    border-radius: 0;
    text-align: left;

    &.selected {
      background-color: #f9f9f9;
    }
  }
}

.settings {
  display: inline-block;
  float: right;
  width: 71%;
  margin: 75px 75px 40px 0px;
  padding: 30px 30px 10px 30px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.loader {
  margin: 20px 0;
}

.mdi {
  float: left;
  margin: 0 30px;
  font-size: 20px;
}
</style>
