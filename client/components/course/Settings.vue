<template>
  <div class="settings">
    <div class="row">
      <div class="col-md-12 content">
        <div class="row">
          <div class="col-md-7">
            <form class="user" @submit.prevent="addUser" novalidate>
              <div class="row">
                <div class="col-md-7 form-group">
                  <input ref="newUserEmail" type="email" class="form-control" placeholder="email" />
                </div>

                <div class="col-md-3 form-group">
                  <select ref="newUserRole" class="form-control select-role">
                    <option v-for="role in roles" :value="role.value">
                      {{ role.render }}
                    </option>
                  </select>
                </div>

                <div class="col-md-2 form-submit">
                  <button type="submit" class="btn btn-primary">Add</button>
                </div>
              </div>
            </form>
          </div>

          <div class="col-md-3 col-md-offset-2">
            <expandable-search @change="search"></expandable-search>
          </div>
        </div>

        <form class="role" v-if="usersExist">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th class="data">User</th>
                <th class="center data" v-for="role in roles">
                  {{ role.render }}
                </th>
                <th class="center data">
                  Remove from course
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(user, index) in users">
                <td class="data">{{ user.email }}</td>

                <td v-for="role in roles" class="center data">
                  <div class="form-group">
                    <input
                      type="radio"
                      :name="user._key"
                      :value="role.value"
                      :checked="user.role === role.value"
                      @click="changeRole(user._key, role.value)"
                    />
                  </div>
                </td>

                <td class="center data">
                  <div class="form-group">
                    <button type="button" class="btn btn-link" @click="remove(user)">
                      <span class="fa fa-lg fa-close"></span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <div v-else>
          <div class="jumbotron">
            {{ noStoredMessage }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import { debounce, isEmpty } from 'lodash';
import ExpandableSearch from '../common/ExpandableSearch';
import { getAdministrativeRoles } from '../../utils/users';

export default {
  name: 'settings',
  components: {
    ExpandableSearch
  },
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
    ...mapActions(['changeUserRole', 'fetchUsersForCourse'], 'course'),
    ...mapMutations(['setUserSearch'], 'course'),
    addUser() {
      // TODO(marko): add action for inviting users to course
      const email = this.$refs.newUserEmail.value;
      const role = this.$refs.newUserRole.value;
      console.log(email, role);
    },
    changeRole(userKey, role) {
      debounce(this.changeUserRole, 500)(userKey, role);
    },
    search(query) {
      this.setUserSearch(query);
    },
    remove(user) {
      console.log('user: ', user.courses);
    }
  },
  created() {
    this.fetchUsersForCourse(this.$route.params.courseKey);
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

  .user {
    padding-bottom: 30px;

    .btn {
      text-align: center;
      width: 150px;
    }

    .form-submit {
      text-align: left;
    }

    .select-role {
      option {
        text-align: center;
      }
    }
  }

  .input-group-addon {
    background-color: #fff;
    border: 0;
  }

  .table {
    margin: 0;
    text-align: left;

    input[type="radio"] {
      margin: 8px 0 0 4px;
    }

    .form-group {
      margin: 0;
    }

    .center {
      text-align: center;
    }

    .data {
      line-height: 2;
      padding: 8px;
    }
  }

  .jumbotron {
    background-color: #fff;
    font-size: 22px;
    font-weight: 500;
    margin: 0;
  }
}
</style>
