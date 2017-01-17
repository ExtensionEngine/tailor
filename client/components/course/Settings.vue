<template>
  <div class="settings">
    <div class="row">
      <div class="col-md-12 content">
        <div class="row">
          <div class="col-md-7">
            <user-invite :roles="roles"></user-invite>
          </div>
          <div class="col-md-3 col-md-offset-2">
            <expandable-search @change="search"></expandable-search>
          </div>
        </div>
        <user-list
          v-if="usersExist"
          :roles="roles"
          :users="users">
        </user-list>
        <div v-else>
          <div class="jumbotron">
            {{ noUsersMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import { isEmpty } from 'lodash';
import ExpandableSearch from '../common/ExpandableSearch';
import UserInvite from './UserInvite';
import UserList from './UserList';
import { getAdministrativeRoles } from '../../utils/users';

export default {
  name: 'settings',
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['users', 'userCount', 'userSearch'], 'course'),
    roles() {
      return getAdministrativeRoles(this.user);
    },
    usersExist() {
      return this.userCount > 0;
    },
    noUsersMessage() {
      const noStoredMessage = 'No users were added to the course, add users?';
      const noFiltered = 'No users found';

      if (!this.userCount && isEmpty(this.userSearch)) {
        return noStoredMessage;
      } else if (!this.userCount) {
        return noFiltered;
      }
    }
  },
  methods: {
    ...mapActions(['fetchUsersForCourse'], 'course'),
    ...mapMutations(['setUserSearch'], 'course'),
    search(query) {
      this.setUserSearch(query);
    }
  },
  created() {
    this.fetchUsersForCourse(this.$route.params.courseKey);
  },
  components: {
    ExpandableSearch,
    UserInvite,
    UserList
  }
};
</script>

<style lang="scss">
.settings {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
  margin: 40px 20px 0;

  .content {
    padding: 40px;
  }

  .jumbotron {
    background-color: #fff;
    font-size: 22px;
    font-weight: 500;
    margin: 0;
  }
}
</style>
