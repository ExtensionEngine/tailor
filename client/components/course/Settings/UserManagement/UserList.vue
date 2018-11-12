<template>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>User</th>
        <th
          v-for="role in roles"
          :key="role.value"
          class="text-center">
          {{ role.title }}
        </th>
        <th class="text-center">Remove from course</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.email }}</td>
        <td
          v-for="role in roles"
          :key="role.value"
          class="text-center">
          <input
            :name="user.id"
            :value="role.value"
            :checked="user.courseRole === role.value"
            @click="changeRole(user.email, role.value)"
            type="radio"/>
        </td>
        <td class="text-center">
          <button @click="remove(user)" type="button" class="btn btn-link">
            <span class="mdi mdi-close"></span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapActions } from 'vuex-module';
import debounce from 'lodash/debounce';

export default {
  props: {
    roles: { type: Array, required: true },
    users: { type: Array, required: true }
  },
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
