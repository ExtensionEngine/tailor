<template>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>User</th>
        <th v-for="role in roles" class="text-center">{{ role.title }}</th>
        <th class="text-center">Remove from course</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.email }}</td>
        <td v-for="role in roles" class="text-center">
          <input
            type="radio"
            :name="user.id"
            :value="role.value"
            :checked="user.courseRole === role.value"
            @click="changeRole(user.email, role.value)"/>
        </td>
        <td class="text-center">
          <button type="button" class="btn btn-link" @click="remove(user)">
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
    ...mapActions(['upsertUser', 'removeUser'], 'course'),
    changeRole(email, role) {
      const { courseId } = this.$route.params;
      debounce(this.upsertUser, 500)({ courseId, email, role });
    },
    remove(user) {
      const { courseId } = this.$route.params;
      this.removeUser({ userId: user.id, courseId });
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
