<template>
  <div class="user-management">
    <div class="row">
      <div class="col-md-12 content">
        <div class="row">
          <div class="col-md-7">
            <form class="user" @submit.prevent="handleAddUser" novalidate>
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
            <expandable-search :setSearch="setSearchFilter"></expandable-search>
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
                      @click="handleChangeRole(user._key, role.value)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
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
import { debounce } from 'lodash';
import { mapActions } from 'vuex-module';

import ExpandableSearch from './ExpandableSearch';

export default {
  name: 'user-management',

  // TODO(marko): substitute courseKey for generic entity?
  props: {
    courseKey: {
      type: String,
      required: true
    },
    roles: {
      type: Array,
      required: true
    },
    users: {
      type: Array,
      required: true
    },
    totalUsers: {
      type: Number,
      required: true
    },
    addUser: {
      type: Function,
      required: true
    },
    changeRole: {
      type: Function,
      required: true
    }
  },

  computed: {
    usersExist() {
      return this.users.length;
    },
    noUsersMessage() {
      const noTotalMessage = 'No users were added to the course, add users?';
      const noFiltered = 'No users found';

      if (!this.totalUsers) {
        return noTotalMessage;
      } else if (!this.users.length) {
        return noFiltered;
      }
    }
  },

  components: {
    'expandable-search': ExpandableSearch
  },

  methods: {
    ...mapActions(['setSearchFilter'], 'users'),
    handleAddUser() {
      const email = this.$refs.newUserEmail.value;
      const role = this.$refs.newUserRole.value;
      this.addUser({ email, role, courseKey: this.courseKey });
    },
    handleChangeRole(userKey, role) {
      debounce(this.changeRole, 1000)({ userKey, role });
    }
  }
};
</script>

<style lang="scss">
.user-management {
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
