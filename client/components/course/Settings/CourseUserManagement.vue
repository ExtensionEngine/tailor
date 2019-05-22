<template>
  <user-management
    :users="users"
    :roles="roles"
    :isLoading="isLoading"
    @upsert="upsert"
    @remove="remove"
    roleType="courseRole"/>
</template>

<script>
import debounce from 'lodash/debounce';
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import { role } from 'shared';
import { title as titleCase } from 'to-case';
import UserManagement from 'components/common/UserManagement';

export default {
  props: {
    courseId: { type: Number, required: true }
  },
  data() {
    return {
      isLoading: true
    };
  },
  computed: {
    ...mapGetters(['users'], 'course'),
    roles() {
      return map(role.course, it => ({
        text: titleCase(it.replace('COURSE', '')),
        value: it
      }));
    }
  },
  methods: {
    ...mapActions(['getUsers', 'upsertUser', 'removeUser'], 'course'),
    upsert: debounce(function (email, role) {
      const { courseId } = this;
      this.isLoading = true;
      this.upsertUser({ email, role, courseId }).then(() => (this.isLoading = false));
    }, 500),
    remove({ id: userId }) {
      const { courseId } = this;
      this.isLoading = true;
      this.removeUser({ userId, courseId }).then(() => (this.isLoading = false));
    }
  },
  created() {
    this.getUsers().then(() => (this.isLoading = false));
  },
  components: {
    UserManagement
  }
};
</script>
