<template>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>User</th>
        <th v-for="role in roles" class="text-center">{{ role.render }}</th>
        <th class="text-center">Remove from course</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users">
        <td>{{ user.email }}</td>
        <td v-for="role in roles" class="text-center">
          <input
            type="radio"
            :name="user._key"
            :value="role.value"
            :checked="user.role === role.value"
            @click="changeRole(user._cid, role.value)"/>
        </td>
        <td class="text-center">
          <button type="button" class="btn btn-link" @click="removeUser(user)">
            <span class="fa fa-close"></span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import debounce from 'lodash/debounce';
import { mapActions } from 'vuex-module';

export default {
  methods: {
    ...mapActions(['update', 'removeFromCourse'], 'users'),
    changeRole(_cid, role) {
      debounce(this.update, 500)({ _cid, role });
    },
    removeUser(user) {
      const userKey = user._key;
      const { courseKey } = this.$route.params;
      this.removeFromCourse({ userKey, courseKey });
    }
  },
  props: {
    roles: { type: Array, required: true },
    users: { type: Array, required: true }
  }
};
</script>

<style lang="scss" scoped>
.table {
  text-align: left;

  input[type="radio"] {
    display: inline-block;
  }
}
</style>
