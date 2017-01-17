<template>
  <form class="role">
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
                @click="changeRole(user._key, role.value)"/>
            </div>
          </td>
          <td class="center data">
            <div class="form-group">
              <button type="button" class="btn btn-link" @click="revokeAccess(user)">
                <span class="fa fa-lg fa-close"></span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
</template>

<script>
import { mapActions } from 'vuex-module';
import { debounce } from 'lodash';

export default {
  name: 'user-list',
  methods: {
    ...mapActions(['changeUserRole', 'revokeAccessToCourse'], 'course'),
    changeRole(userKey, role) {
      debounce(this.changeUserRole, 500)({ userKey, role });
    },
    revokeAccess(user) {
      const userKey = user._key;
      const courseKey = this.$route.params.courseKey;
      this.revokeAccessToCourse({ userKey, courseKey });
    }
  },
  props: {
    roles: {
      type: Array,
      required: true
    },
    users: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss">
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
</style>
